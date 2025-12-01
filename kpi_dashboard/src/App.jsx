<<<<<<< HEAD
import React from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Login from './Components/Login.jsx'
import Home from './Components/Home.jsx'
import Register from './Components/Register.jsx'
import RequestSent from './Components/RequestSent.jsx'
import CompleteProfile from './Components/CompleteProfile.jsx'
import { authClient } from './utils/authClient.js'

const needsProfileCompletion = (user) =>
  !user?.username ||
  !user?.phone ||
  !user?.accountType ||
  user.username.startsWith('pending_') ||
  user.phone === '__pending__'

const RequireAuth = ({ children }) => {
  const location = useLocation()
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Checking session...
      </div>
    )
  }

  if (!session?.user) {
    return <Navigate to="/" replace state={{ from: location }} />
  }

  if (needsProfileCompletion(session.user) && location.pathname !== '/complete-profile') {
    return <Navigate to="/complete-profile" replace />
  }

  return children
}

const RequireGuest = ({ children }) => {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Checking session...
      </div>
    )
  }

  if (session?.user) {
    if (needsProfileCompletion(session.user)) {
      return <Navigate to="/complete-profile" replace />
    }
    return <Navigate to="/home" replace />
  }

  return children
}
=======
// src/App.jsx
import React, { useEffect, useState } from "react";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider, useMsal } from "@azure/msal-react";
import Home from "./Components/Home.jsx";

const pca = new PublicClientApplication({
  auth: {
    clientId: "a972773a-46e3-47dd-aea6-80fb76f1f6a6",
    authority: "https://login.microsoftonline.com/41f88ecb-ca63-404d-97dd-ab0a169fd138",
    redirectUri: window.location.origin,
  },
  cache: { cacheLocation: "localStorage" },
});
>>>>>>> 41fbf86 (feat(task-504): cherry-pick real Microsoft Entra ID SSO implementation with MSAL and backend validationfeat(task-504): implement real Microsoft Entra ID SSO with MSAL and backend token validation; cleanup duplicates; update README)

function App() {
  const { instance } = useMsal();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    instance.initialize().then(() => {
      setInitialized(true);
      instance.handleRedirectPromise().then((res) => {
        if (res?.idToken) {
          fetch("http://localhost:8000/auth/exchange", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: res.idToken }),
          })
            .then(r => r.json())
            .then(d => {
              localStorage.setItem("token", d.access_token);
              window.location.href = "/home";
            });
        }
      });
    });
  }, [instance]);

  if (!initialized) return <div>Loading...</div>;

  if (localStorage.getItem("token")) return <Home />;

  return (
<<<<<<< HEAD
    <div className="App">
        <Routes>
            <Route
              path="/"
              element={
                <RequireGuest>
                  <Login />
                </RequireGuest>
              }
            />
            <Route
              path="/home"
              element={
                <RequireAuth>
                  <Home />
                </RequireAuth>
              }
            />
            <Route
              path="/complete-profile"
              element={
                <RequireAuth>
                  <CompleteProfile />
                </RequireAuth>
              }
            />
            <Route
              path="/register"
              element={
                <RequireGuest>
                  <Register />
                </RequireGuest>
              }
            />
            <Route path="/request-sent" element={<RequestSent />} />
        </Routes>
=======
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-r from-red-400 via-slate-300 to-blue-400">
      <div className="bg-white p-24 rounded-3xl shadow-2xl text-center">
        <h1 className="text-7xl font-bold mb-16 text-gray-800">FAMAR KPI Dashboard</h1>
        <button
          onClick={() => {
            localStorage.clear();
            instance.loginRedirect();
          }}
          className="px-20 py-10 bg-blue-600 hover:bg-blue-700 text-white text-4xl font-bold rounded-2xl shadow-2xl transition transform hover:scale-105"
        >
          Sign in with Microsoft
        </button>
      </div>
>>>>>>> 41fbf86 (feat(task-504): cherry-pick real Microsoft Entra ID SSO implementation with MSAL and backend validationfeat(task-504): implement real Microsoft Entra ID SSO with MSAL and backend token validation; cleanup duplicates; update README)
    </div>
  );
}

<<<<<<< HEAD
export default App
=======
export default function Root() {
  return (
    <MsalProvider instance={pca}>
      <App />
    </MsalProvider>
  );
}
>>>>>>> 41fbf86 (feat(task-504): cherry-pick real Microsoft Entra ID SSO implementation with MSAL and backend validationfeat(task-504): implement real Microsoft Entra ID SSO with MSAL and backend token validation; cleanup duplicates; update README)
