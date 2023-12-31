import React, { useEffect, useState } from "react";
import {
  getContractsPerClient,
  getContractsPerFreelancer,
} from "./utils/freelance";
import { getAccountId } from "./utils/near";
import "./ViewContracts.css"; // Import the CSS file

function ViewContracts() {
  const [clientContracts, setClientContracts] = useState([]);
  const [freelancerContracts, setFreelancerContracts] = useState([]);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const accountId = await getAccountId(); // Await the resolved account ID

        if (accountId) {
          const fetchedClientContracts = await getContractsPerClient(accountId);
          setClientContracts(fetchedClientContracts);

          const fetchedFreelancerContracts = await getContractsPerFreelancer(
            accountId
          );
          setFreelancerContracts(fetchedFreelancerContracts);
        } else {
          console.error("Account ID not found");
        }
      } catch (error) {
        console.error("Error fetching contracts:", error);
      }
    };

    fetchContracts();
  }, []);

  const renderContractCard = (contract) => {
    const statusClass = `contract-status status-${contract.status
      .replace(/\s+/g, "-")
      .toLowerCase()}`;

    return (
      <div className="contract-card" key={contract.id}>
        <p>
          <strong>ID:</strong> {contract.id}
        </p>
        <p>
          <strong>Client:</strong> {contract.client}
        </p>
        <p>
          <strong>Freelancer:</strong> {contract.freelancer}
        </p>
        <p>
          <strong>Description:</strong> {contract.description}
        </p>
        <p>
          <strong>Amount:</strong> {contract.amount}
        </p>
        <p>
          <strong>Locked Amount:</strong> {contract.lockedamount}
        </p>
        <p>
          <strong>Deadline:</strong>{" "}
          {new Date(contract.deadline).toLocaleDateString()}
        </p>
        <p>
          <strong>Link:</strong> {contract.link || "N/A"}
        </p>
        <p>
          <strong>Info:</strong> {contract.info || "N/A"}
        </p>
        <p className={statusClass}>{contract.status}</p>
        {/* Add more fields as needed */}
      </div>
    );
  };

  return (
    <div className="view-contracts-container">
      <h2>My Contracts as Client</h2>
      {clientContracts.map(renderContractCard)}

      <h2>My Contracts as Freelancer</h2>
      {freelancerContracts.map(renderContractCard)}
    </div>
  );
}

export default ViewContracts;
