// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";  
import Root from "./App.jsx";
import "./main.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>  {/* <-- Wrap Root with BrowserRouter */}
      <Root />
    </BrowserRouter>
  </React.StrictMode>
);