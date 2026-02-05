import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import './main.css'
import App from "./App.jsx";
import Home from "./Components/Home.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <Router>
            <Home />
        </Router>
    </React.StrictMode>
);