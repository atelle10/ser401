// src/App.jsx
import React, { useEffect, useState } from "react";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react"; 
import Home from "./Components/Home.jsx";

const pca = new PublicClientApplication({
  auth: {
    clientId: "a972773a-46e3-47dd-aea6-80fb76f1f6a6",
    authority: "https://login.microsoftonline.com/41f88ecb-ca63-404d-97dd-ab0a169fd138",
    redirectUri: window.location.origin,
  },
  cache: { cacheLocation: "localStorage" },
});

function App() {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    pca.initialize().then(() => {
      setInitialized(true);
      pca.handleRedirectPromise()
        .then((res) => {
          if (res?.idToken) {
            fetch("http://localhost:8000/auth/exchange", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token: res.idToken }),
            })
              .then(r => {
                if (!r.ok) throw new Error("Exchange failed");
                return r.json();
              })
              .then(d => {
                localStorage.setItem("token", d.access_token);
                window.location.href = "/home";  // Or just re-render Home
              })
              .catch(err => {
                console.error("Exchange error:", err);
                setError("Login failed — please try again");
              });
          }
        })
        .catch(err => {
          console.error("Redirect error:", err);
          setError("Authentication error");
        });
    }).catch(err => {
      console.error("MSAL init failed:", err);
      setError("App failed to load");
    });
  }, []);

  if (!initialized) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center h-screen text-red-600 text-2xl">{error}</div>;

  if (localStorage.getItem("token")) return <Home />;

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-r from-red-400 via-slate-300 to-blue-400">
      <div className="bg-white p-24 rounded-3xl shadow-2xl text-center">
        <h1 className="text-7xl font-bold mb-16 text-gray-800">FAMAR KPI Dashboard</h1>
        <button
  onClick={() => {
    // Clear MSAL cache + your token
    localStorage.clear();  // Nukes everything safely for dev

    pca.loginRedirect({
      scopes: ["openid", "profile", "User.Read"],
      prompt: "login"  // Forces fresh Microsoft login, ignores cache
    });
  }}
  className="px-20 py-10 bg-blue-600 hover:bg-blue-700 text-white text-4xl font-bold rounded-2xl shadow-2xl transition transform hover:scale-105"
>
  Sign in with Microsoft
</button>
      </div>
    </div>
  );
}

export default function Root() {
  return (
    <MsalProvider instance={pca}>
      <App />
    </MsalProvider>
  );
}
