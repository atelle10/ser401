import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import loginLogo from './assets/login_logo.png';
import famarLogo from './assets/famar_logo.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/auth/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: password, redirect_uri: "http://localhost:5173" })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Invalid code");

      localStorage.setItem("token", data.access_token);
      window.location.href = "/home";
    } catch (err) {
      setError("Invalid code — try: admincode | viewercode | mockcode");
    }
  };

  if (localStorage.getItem("token")) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-r to-blue-400 via-slate-300 from-red-400 p-4">
      <div className='absolute inset-0 bg-no-repeat bg-center opacity-70' style={{ backgroundImage: `url(${loginLogo})` }}></div>
      
      <div className="relative bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex justify-center mb-8">
          <img src={famarLogo} alt="FAMAR" className="h-32" />
        </div>
        <h1 className="text-3xl font-bold text-center mb-2">Welcome Back</h1>
        <p className="text-center text-gray-600 mb-8">Sign in to continue</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Access Code</label>
            <input
              type="password"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="admincode | viewercode | mockcode"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg text-center">{error}</div>}
          <button type="submit" className="w-full py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
