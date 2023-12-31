import { utils } from "near-api-js";

// Add functions for each contract method
export async function createContract(payload) {
  // Assuming YNEAR is defined somewhere globally or imported
  const amountInYoctoNEAR = utils.format.parseNearAmount(
    payload.amount.toString()
  );

  return await window.contract.create_contract(
    { payload },
    300000000000000,
    amountInYoctoNEAR
  );
}

export async function acceptContract(contractId) {
  try {
    // Fetch the contract details
    const contract = await getContractById(contractId);

    // Extract the locked amount and convert it to yoctoNEAR
    const lockedAmountInYoctoNEAR = utils.format.parseNearAmount(
      contract.lockedamount.toString()
    );

    // Call the smart contract's accept_contract method
    return await window.contract.accept_contract(
      { contract_id: contractId },
      300000000000000, // Attached GAS (this value might need adjustment)
      lockedAmountInYoctoNEAR
    );
  } catch (error) {
    console.error("Error in acceptContract:", error);
    throw error; // Re-throw the error for handling by the caller
  }
}

export async function rejectContract(contractId, info) {
  return await window.contract.reject_contract({
    contract_id: contractId,
    info,
  });
}

export async function submitWork(contractId, link) {
  return await window.contract.submit_work({ contract_id: contractId, link });
}

export async function payment(contractId) {
  return await window.contract.payment({ contract_id: contractId });
}

export async function getContractById(contractId) {
  return window.contract.get_contract_by_id({ contract_id: contractId });
}

export function getContractsPerClient(accountId) {
  return window.contract.get_contracts_per_client({ account_id: accountId });
}

export function getContractsPerFreelancer(accountId) {
  return window.contract.get_contracts_per_freelancer({
    account_id: accountId,
  });
}
