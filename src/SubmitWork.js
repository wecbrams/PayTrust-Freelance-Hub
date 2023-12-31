import React, { useState } from "react";
import { submitWork } from "./utils/freelance";
import "./SubmitWork.css"; // Import the CSS file

function SubmitWork() {
  const [contractId, setContractId] = useState("");
  const [workLink, setWorkLink] = useState("");

  const handleSubmitWork = async () => {
    try {
      await submitWork(contractId, workLink);
      alert("Work submitted successfully");
    } catch (error) {
      console.error("Failed to submit work:", error);
    }
  };

  return (
    <div className="submit-work-container">
      <h2>Submit Work</h2>
      <div className="submit-work-form">
        <input
          type="text"
          value={contractId}
          onChange={(e) => setContractId(e.target.value)}
          placeholder="Contract ID"
        />
        <input
          type="text"
          value={workLink}
          onChange={(e) => setWorkLink(e.target.value)}
          placeholder="Link to Work"
        />
        <button onClick={handleSubmitWork}>Submit Work</button>
      </div>
    </div>
  );
}

export default SubmitWork;
