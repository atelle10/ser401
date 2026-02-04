import React, { useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Home from './Components/Home.jsx';
import CompleteProfile from './Components/CompleteProfile.jsx';
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { loginRequest } from "./auth/msal.js";

// Helper to check if we have a token (persisted auth state)
const hasToken = () => !!localStorage.getItem("access_token");

const ProtectedRoute = ({ children }) => {
  const msalAuthenticated = useIsAuthenticated();
  const tokenAuthenticated = hasToken();
  const location = useLocation();

  if (!msalAuthenticated && !tokenAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return children;
};

const Login = () => {
  const { instance } = useMsal();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsPending(true);
    try {
      const res = await fetch("/auth/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Login failed");
      const data = await res.json();
      localStorage.setItem("access_token", data.access_token);
      window.location.href = "/home";  // Force reload to re-check auth
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setIsPending(false);
    }
  };

  const handleMicrosoftLogin = async () => {
    setError("");
    setIsPending(true);
    try {
      const response = await instance.loginPopup(loginRequest);
      console.log("MSAL popup success:", response);

      const res = await fetch("/auth/exchange", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: response.idToken }),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Token exchange failed: ${err}`);
      }
      const data = await res.json();
      localStorage.setItem("access_token", data.access_token);
      console.log("Token stored — redirecting to /home");
      window.location.href = "/home";  // Force reload to re-check auth
    } catch (e) {
      setError("Microsoft login failed");
      console.error("Microsoft login error:", e);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-r from-red-400 via-slate-300 to-blue-400">
      <div className="bg-white p-12 rounded-3xl shadow-2xl w-full max-w-md">
        <h1 className="text-5xl font-bold mb-8 text-center text-gray-800">
          FAMAR KPI Dashboard
        </h1>

        {/* Email/Password Form */}
        <form onSubmit={handleEmailLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
              disabled={isPending}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              disabled={isPending}
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition disabled:opacity-70"
          >
            {isPending ? "Signing in..." : "Sign in with Email"}
          </button>
        </form>

        <div className="my-8 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-gray-500 text-sm">or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <button
          type="button"  
          onClick={handleMicrosoftLogin}
          disabled={isPending}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition flex items-center justify-center gap-3 disabled:opacity-70"
        >
          <svg className="w-6 h-6" viewBox="0 0 23 23" fill="white">
            <path d="M0 0h11v11H0z" fill="#f3f3f3"/>
            <path d="M12 0h11v11H12z" fill="#f35325"/>
            <path d="M0 12h11v11H0z" fill="#81bc06"/>
            <path d="M12 12h11v11H12z" fill="#05a6f0"/>
          </svg>
          {isPending ? "Signing in..." : "Sign in with Microsoft"}
        </button>
      </div>
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/complete-profile" element={<ProtectedRoute><CompleteProfile /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;