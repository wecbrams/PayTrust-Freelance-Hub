import environment from "./config";
import { connect, Contract, keyStores, WalletConnection } from "near-api-js";
import { formatNearAmount } from "near-api-js/lib/utils/format";

const nearEnv = environment("testnet");
export async function initializeContract() {
  const near = await connect(
    Object.assign(
      { keyStore: new keyStores.BrowserLocalStorageKeyStore() },
      nearEnv
    )
  );

  const appKeyPrefix = "freelance"; // Replace with your app's unique identifier

  window.walletConnection = new WalletConnection(near, appKeyPrefix);
  window.accountId = window.walletConnection.getAccountId();
  window.contract = new Contract(
    window.walletConnection.account(),
    nearEnv.contractName,
    {
      viewMethods: [
        "get_contracts",
        "get_blacklist",
        "get_contract_by_id",
        "get_contracts_per_client",
        "get_contracts_per_freelancer",
      ],
      changeMethods: [
        "create_contract",
        "accept_contract",
        "report_accept_contract",
        "reject_contract",
        "submit_work",
        "report_work_submission",
        "payment",
        "reject_payment",
        "report_payment",
      ],
    }
  );
}

export async function accountBalance() {
  return formatNearAmount(
    (await window.walletConnection.account().getAccountBalance()).total,
    2
  );
}

export async function getAccountId() {
  return window.walletConnection.getAccountId();
}

export function login() {
  return window.walletConnection.requestSignIn({
    contractId: nearEnv.contractName,
  });
}

export function logout() {
  window.walletConnection.signOut();
  window.location.reload();
}

// Function to check if the user is signed in
export function isSignedIn(walletConnection) {
  return window.walletConnection.isSignedIn();
}
