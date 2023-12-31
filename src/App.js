import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { initializeContract, login, logout, isSignedIn } from "./utils/near";
import CreateContract from "./CreateContract";
import AcceptContract from "./AcceptContract";
import SubmitWork from "./SubmitWork";
import ViewContracts from "./ViewContracts";
import RejectContract from "./RejectContract";
import PayContract from "./Payment";
import "./App.css"; // Import the CSS file

function App() {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    initializeContract()
      .then(() => {
        setSignedIn(isSignedIn());
      })
      .catch(console.error);
  }, []);

  const handleLogin = () => {
    login();
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <Router>
      <div>
        <nav className="navbar">
          <ul>
            <li>
              <Link to="/create-contract">Create Contract</Link>
            </li>
            <li>
              <Link to="/accept-contract">Accept Contract</Link>
            </li>
            <li>
              <Link to="/reject-contract">Reject Contract</Link>
            </li>
            <li>
              <Link to="/submit-work">Submit Work</Link>
            </li>
            <li>
              <Link to="/pay-contract">Pay Contract</Link>
            </li>
            <li>
              <Link to="/view-contracts">View Contracts</Link>
            </li>
          </ul>
          {!signedIn ? (
            <button onClick={handleLogin}>Connect Wallet</button>
          ) : (
            <button onClick={handleLogout}>Sign out</button>
          )}
        </nav>

        <Routes>
          <Route path="/create-contract" element={<CreateContract />} />
          <Route path="/accept-contract" element={<AcceptContract />} />
          <Route path="/reject-contract" element={<RejectContract />} />
          <Route path="/submit-work" element={<SubmitWork />} />
          <Route path="/pay-contract" element={<PayContract />} />
          <Route path="/view-contracts" element={<ViewContracts />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
