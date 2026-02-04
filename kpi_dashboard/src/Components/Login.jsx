import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authClient } from '../utils/authClient';  
import { useMsal } from '@azure/msal-react';  
const Login = () => {
  const navigate = useNavigate();
  const { instance } = useMsal();  // MSAL instance from provider in main.jsx/App.jsx
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    const result = await authClient.signIn.email({ email, password });
    setIsSubmitting(false);

    if (result?.error) {
      setError(result.error.message || 'Login failed');
      return;
    }

    navigate('/home', { replace: true });
  };

  const handleMicrosoftLogin = () => {
    instance.loginRedirect({ prompt: 'login' });  // Force fresh login, real MSAL redirect
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-r to-blue-400 via-slate-300 from-red-400">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">FAMAR Login</h1>

        {/* Microsoft SSO Button  */}
        <button
          onClick={handleMicrosoftLogin}
          disabled={isSubmitting}
          className="w-full py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 mb-6 flex items-center justify-center gap-3"
        >
          <svg className="h-6 w-6" viewBox="0 0 23 23">
            <rect x="1" y="1" width="10" height="10" fill="#F25022" />
            <rect x="12" y="1" width="10" height="10" fill="#7FBA00" />
            <rect x="1" y="12" width="10" height="10" fill="#00A4EF" />
            <rect x="12" y="12" width="10" height="10" fill="#FFB900" />
          </svg>
          Sign in with Microsoft
        </button>

        <div className="text-center text-gray-600 mb-6">or sign in with email</div>

        {/* Email Form (better-auth) */}
        <form onSubmit={handleEmailLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
              autoComplete="current-password"
            />
          </div>
          {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg text-center">{error}</div>}
          <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700">
            Sign in with Email
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;