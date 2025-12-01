import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import loginLogo from './assets/login_logo.png';
import famarLogo from './assets/famar_logo.png';

let loggedIn = false;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    // Handle login logic here (e.g., send credentials to an API)
    console.log('Username:', username, 'Password:', password);
    loggedIn = true;
    setUsername('');
    setPassword('');
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-r to-blue-400 via-slate-300 from-red-400 p-4">
      <div className='absolute inset-0 bg-no-repeat bg-center opacity-70' style={{ backgroundImage: `url(${loginLogo})` }}></div>
      
      {/* Main Login Card - matching dashboard style - Mobile Responsive */}
      <div className="relative bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 w-full max-w-md space-y-4 sm:space-y-6">
        {/* Logo */}
        <div className="flex justify-center">
          <img 
            src={famarLogo} 
            alt="Famar Logo" 
            className="w-24 h-24 sm:w-32 sm:h-32 object-contain" 
          />
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">Sign in to continue to dashboard</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Input */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              type="text"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              type="password"
              placeholder="Enter your password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Login Button */}
          <button 
            type="submit" 
            className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-lg"
          >
            Login
          </button>

          {/* Register Link */}
          <div className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link 
              className="text-blue-600 font-semibold hover:text-blue-700 hover:underline" 
              to="/register"
            >
              Register Here
            </Link>
          </div>
        </form>
      </div>
      
      {loggedIn && <Navigate to="/home" replace />}
    </div>
  );
};

export default Login;