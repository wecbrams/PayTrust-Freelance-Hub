import React, { useState } from "react";
import { acceptContract } from "./utils/freelance";
import "./AcceptContract.css"; // Import the CSS file

function AcceptContract() {
  const [contractId, setContractId] = useState("");

  const handleAcceptContract = async () => {
    try {
      await acceptContract(contractId);
      alert("Contract accepted successfully");
    } catch (error) {
      console.error("Failed to accept contract:", error);
    }
  };

  return (
    <div className="accept-contract-container">
      <h2>Accept Contract</h2>
      <div className="accept-contract-form">
        <input
          type="text"
          value={contractId}
          onChange={(e) => setContractId(e.target.value)}
          placeholder="Contract ID"
        />
        <button onClick={handleAcceptContract}>Accept Contract</button>
      </div>
    </div>
  );
}

export default AcceptContract;
