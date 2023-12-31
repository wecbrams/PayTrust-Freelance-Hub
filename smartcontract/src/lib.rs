use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::{env, near_bindgen, AccountId, PanicOnDefault, Promise, Timestamp};
use near_sdk::serde::{Serialize, Deserialize};

const YNEAR:u128 = 1_000_000_000_000_000_000_000_000;

#[derive(Serialize, Deserialize, PanicOnDefault)]
pub struct Payload {
    id: String,
    freelancer: AccountId,
    description: String,
    amount: u128,
    lockedamount: u128,
    deadline: Timestamp
}

#[derive(BorshSerialize, BorshDeserialize, Serialize, PanicOnDefault)]
pub struct Contract {
    id: String,
    time:Timestamp,
    client: AccountId,
    freelancer: AccountId,
    description: String,
    amount: u128,
    lockedamount: u128,
    deadline: Timestamp,
    link:String,
    status:String,
    info: String,
}

impl Contract {
    pub fn from_payload(payload: Payload) -> Self {
        Self {
            id: payload.id,
            time: env::block_timestamp(),
            client: env::predecessor_account_id(),
            freelancer: payload.freelancer,
            description: payload.description,
            amount: payload.amount,
            lockedamount: payload.lockedamount,
            deadline: payload.deadline,
            link:String::new(),
            status:"Waiting for the Freelancer's Acceptance".to_string(),
            info: String::new(),
        }
    }

    pub fn update_status(&mut self, status:String) {
        self.status = status
    }

    pub fn update_link(&mut self, link:String) {
        self.link = link
    }

    pub fn update_info(&mut self, info:String) {
        self.info = info
    }

}


#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contracts {
    listed_contracts: UnorderedMap<String, Contract>,
    black_list:UnorderedMap<String, Contract>
}

#[near_bindgen]
impl Contracts {
    #[init]
    pub fn init() -> Self {
        Self {
            listed_contracts: UnorderedMap::new(b"listed_contracts".to_vec()),
            black_list:UnorderedMap::new(b"black_list".to_vec())
        }
    }

    #[payable]
    pub fn create_contract(&mut self, payload: Payload) {
        let amount = payload.amount * YNEAR;
        assert_eq! (env::attached_deposit(), amount, "attached deposit should be equal to the deal amount");
        let contract = Contract::from_payload(payload);
        self.listed_contracts.insert(&contract.id, &contract);
    }

    #[payable]
    pub fn accept_contract(&mut self, contract_id: String) {
        let mut contract = self.listed_contracts.get(&contract_id).unwrap();
        assert_eq!(env::predecessor_account_id(),contract.freelancer,"this function should be executed only by the freelancer!!");
        assert_eq!(contract.status,"Waiting for the Freelancer's Acceptance".to_string());
        let locked_amount = contract.lockedamount * YNEAR;
        assert_eq!(env::attached_deposit(),locked_amount, "attached deposit should be equal to the deal locked amount");
        contract.update_status("Contract accepted, waiting for the Freelancer's submission".to_string());
        self.listed_contracts.insert(&contract_id, &contract);
    }

    pub fn report_accept_contract(&mut self, contract_id: String) {
        let mut contract = self.listed_contracts.get(&contract_id).unwrap();
        assert_eq!(env::predecessor_account_id(), contract.client,"this function should be executed only by the client!!");
        assert_eq!(contract.status,"Waiting for the Freelancer's Acceptance".to_string());
        assert!(env::block_timestamp() > contract.time + 86400,"to make an acceptance contract report you need to wait 24 hours after the time of the creation of the contract");
        Promise::new(env::predecessor_account_id()).transfer(contract.amount*YNEAR);
        contract.update_status("Contract deprected".to_string());
        self.listed_contracts.insert(&contract_id, &contract);
    }

    pub fn reject_contract(&mut self, contract_id: String, info: String) {
        let mut contract = self.listed_contracts.get(&contract_id).unwrap();
        assert_eq!(env::predecessor_account_id(),contract.freelancer,"this function should be executed only by the freelancer!!");
        assert_eq!(contract.status,"Waiting for the Freelancer's Acceptance".to_string());
        let client = &contract.client;
        Promise::new(client.parse().unwrap()).transfer(contract.amount*YNEAR);
        contract.update_status("Contract rejected".to_string());
        contract.update_info(info);
        self.listed_contracts.insert(&contract_id, &contract);
    }

    pub fn submit_work(&mut self, contract_id: String, link: String) {
        let mut contract = self.listed_contracts.get(&contract_id).unwrap();
        assert_eq!(env::predecessor_account_id(), contract.freelancer,"this function should be executed only by the freelancer!!");
        assert_eq!(contract.status,"Contract accepted, waiting for the Freelancer's submission".to_string());
        assert_eq!(env::block_timestamp() < contract.deadline * 1000000,true,"Submission out of the deadline");
        contract.update_link(link);
        contract.update_status("Work submitted".to_string());
        self.listed_contracts.insert(&contract_id, &contract);
    }

    pub fn report_work_submission(&mut self, contract_id: String) {
        let mut contract = self.listed_contracts.get(&contract_id).unwrap();
        assert_eq!(env::predecessor_account_id(), contract.client,"this function should be executed only by the client!!");
        assert_eq!(contract.link.is_empty(), true,"the submission was already executed");
        assert_eq!(contract.status,"Contract accepted, waiting for the Freelancer's submission".to_string());
        assert!(env::block_timestamp() > contract.deadline,"the submission deadline doesn't reached yet");
        Promise::new(env::predecessor_account_id()).transfer(((4 * contract.lockedamount)/5)*YNEAR);
        contract.update_status("Contract interrumped".to_string());
        self.listed_contracts.insert(&contract_id, &contract);
    }

    pub fn payment(&mut self, contract_id: String) {
        let mut contract = self.listed_contracts.get(&contract_id).unwrap();
        assert_eq!(env::predecessor_account_id(), contract.client,"this function should be executed only by the client!!");
        assert_eq!(contract.status,"Work submitted".to_string(),"work need to be submitted first");
        let freelancer = &contract.freelancer;
        Promise::new(freelancer.parse().unwrap()).transfer(((4*contract.amount)/5)*YNEAR);
        contract.update_status("Contract executed successfully".to_string());
        self.listed_contracts.insert(&contract_id, &contract);
    }

    pub fn reject_payment(&mut self, contract_id: String, info: String) {
        let mut contract = self.listed_contracts.get(&contract_id).unwrap();
        assert_eq!(env::predecessor_account_id(), contract.client,"this function should be executed only by the client!!");
        assert_eq!(contract.status,"Work submitted".to_string(),"work need to be submitted first");
        contract.update_status("Reject contract payment".to_string());
        contract.update_info(info);
        self.listed_contracts.insert(&contract_id, &contract);
        self.black_list.insert(&contract_id, &contract);
    }

    pub fn report_payment(&mut self, contract_id: String, info: String) {
        let mut contract = self.listed_contracts.get(&contract_id).unwrap();
        assert_eq!(env::predecessor_account_id(), contract.freelancer,"this function should be executed only by the freelancer!!");
        assert_eq!(contract.status,"Work submitted".to_string(),"work need to be submitted first");
        assert!(env::block_timestamp() > contract.deadline + 86400,"to make a payment report you need to wait 24 hours after the deadline");
        contract.update_status("Report contract payment".to_string());
        contract.update_info(info);
        self.listed_contracts.insert(&contract_id, &contract);
        self.black_list.insert(&contract_id, &contract);
    }

    pub fn get_contracts(&self) -> Vec<Contract>{
        return self.listed_contracts.values_as_vector().to_vec();
    }

    pub fn get_blacklist(&self) -> Vec<Contract>{
        return self.black_list.values_as_vector().to_vec();
    }

    pub fn get_contract_by_id(&self, contract_id: String) -> Contract {
        return self.listed_contracts.get(&contract_id).unwrap();
    }

    pub fn get_contracts_per_client(&self, account_id: String) -> Vec<Contract>{
        let mut res = Vec::new();
        for i in 0..self.listed_contracts.values_as_vector().len() {
            if self.listed_contracts.values_as_vector().get(i).unwrap().client == account_id {
                res.push(self.listed_contracts.values_as_vector().get(i).unwrap())
            }
        }
        return res;
    }

    pub fn get_contracts_per_freelancer(&self, account_id: String) -> Vec<Contract>{
        let mut res = Vec::new();
        for i in 0..self.listed_contracts.values_as_vector().len() {
            if self.listed_contracts.values_as_vector().get(i).unwrap().freelancer == account_id {
                res.push(self.listed_contracts.values_as_vector().get(i).unwrap())
            }
        }
        return res;
    }

}