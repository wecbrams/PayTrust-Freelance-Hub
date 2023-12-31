import React, { useState } from "react";
import { rejectContract } from "./utils/freelance";
import "./RejectContract.css"; // Import the CSS file

function RejectContract() {
  const [contractId, setContractId] = useState("");
  const [info, setInfo] = useState("");

  const handleRejectContract = async () => {
    try {
      await rejectContract(contractId, info);
      alert("Contract rejected successfully");
    } catch (error) {
      console.error("Failed to reject contract:", error);
    }
  };

  return (
    <div className="reject-contract-container">
      <h2>Reject Contract</h2>
      <div className="reject-contract-form">
        <input
          type="text"
          value={contractId}
          onChange={(e) => setContractId(e.target.value)}
          placeholder="Contract ID"
        />
        <textarea
          value={info}
          onChange={(e) => setInfo(e.target.value)}
          placeholder="Enter details for rejection"
        />
        <button onClick={handleRejectContract}>Reject Contract</button>
      </div>
    </div>
  );
}

export default RejectContract;
