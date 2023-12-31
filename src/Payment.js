import React, { useState } from "react";
import { payment } from "./utils/freelance";
import "./Payment.css"; // Import the CSS file

function PayContract() {
  const [contractId, setContractId] = useState("");

  const handlePayment = async () => {
    try {
      await payment(contractId);
      alert("Contract paid successfully");
    } catch (error) {
      console.error("Failed to pay contract:", error);
    }
  };

  return (
    <div className="pay-contract-container">
      <h2>Pay Contract</h2>
      <div className="pay-contract-form">
        <input
          type="text"
          value={contractId}
          onChange={(e) => setContractId(e.target.value)}
          placeholder="Contract ID"
        />
        <button onClick={handlePayment}>Pay Contract</button>
      </div>
    </div>
  );
}

export default PayContract;
