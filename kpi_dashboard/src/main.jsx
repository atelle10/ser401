import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import App from "./App.jsx";
import "./main.css";

const msalConfig = {
  auth: {
    clientId: "a972773a-46e3-47dd-aea6-80fb76f1f6a6",
    authority: "https://login.microsoftonline.com/41f88ecb-ca63-404d-97dd-ab0a169fd138",
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "sessionStorage",
  },
};

const msalInstance = new PublicClientApplication(msalConfig);


msalInstance.initialize().catch(err => console.error("MSAL initialize failed:", err));

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <MsalProvider instance={msalInstance}>
        <App />
      </MsalProvider>
    </BrowserRouter>
  </React.StrictMode>
);