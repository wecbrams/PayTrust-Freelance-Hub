import React, { useState } from "react";
import { createContract } from "./utils/freelance";
import { v4 as uuidv4 } from "uuid";
import "./CreateContract.css"; // Import the CSS file

function CreateContract() {
  const [freelancer, setFreelancer] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [lockedAmount, setLockedAmount] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        id: uuidv4(),
        freelancer,
        description,
        amount: Number(amount),
        lockedamount: Number(lockedAmount),
        deadline: new Date(deadline).getTime(), // Convert to timestamp
      };

      await createContract(payload);
      alert("Contract created successfully");
    } catch (error) {
      console.error("Failed to create contract:", error);
    }
  };

  return (
    <div className="create-contract-container">
      <h2>Create Contract</h2>
      <form onSubmit={handleSubmit} className="create-contract-form">
        <label className="form-label">Freelancer Account ID</label>
        <input
          type="text"
          value={freelancer}
          onChange={(e) => setFreelancer(e.target.value)}
          placeholder="e.g., alice.near"
        />
        <label className="form-label">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detailed description of the contract"
        />
        <label className="form-label">Amount (in NEAR)</label>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Total contract amount"
        />
        <label className="form-label">Locked Amount (in NEAR)</label>
        <input
          type="text"
          value={lockedAmount}
          onChange={(e) => setLockedAmount(e.target.value)}
          placeholder="Amount to lock for contract"
        />
        <label className="form-label">Deadline</label>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <button type="submit">Create Contract</button>
      </form>
    </div>
  );
}

export default CreateContract;
