import { Buffer } from "buffer";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { initializeContract } from "./utils/near";

window.Buffer = Buffer;

initializeContract()
  .then(() => {
    ReactDOM.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
      document.getElementById("root")
    );
  })
  .catch((error) => {
    console.error("Failed to initialize contract:", error);
    // Handle initialization failure, possibly with a user-friendly message
  });
