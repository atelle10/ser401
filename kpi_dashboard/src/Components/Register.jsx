<<<<<<< HEAD
import React, { useState, useEffect } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { authClient } from '../utils/authClient';
import loginLogo from './assets/login_logo.png'
import backgroundImage from './assets/sfd_bg.png';
=======
    import React, { useEffect, useState } from 'react';
    import Home from './Home';
>>>>>>> 41fbf86 (feat(task-504): cherry-pick real Microsoft Entra ID SSO implementation with MSAL and backend validationfeat(task-504): implement real Microsoft Entra ID SSO with MSAL and backend token validation; cleanup duplicates; update README)

    let loggedIn = false;
    let loginStatus = '';

<<<<<<< HEAD
const Register = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [accountType, setAccountType] = useState('');
  const [error, setError] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registered, setRegistered] = useState(false);
=======
    const Register = () => {
      const [firstName, setFirstName] = useState('');
      const [lastName, setLastName] = useState('');
      const [username, setUsername] = useState('');
      const [password, setPassword] = useState('');
      const [borderColor, setBorderColor] = useState('border-gray-400');
      const [confirmPassword, setConfirmPassword] = useState('');
      const [email, setEmail] = useState('');
      const [phone, setPhone] = useState('');
      const [accountType, setAccountType] = useState('Select Account Type');
>>>>>>> 41fbf86 (feat(task-504): cherry-pick real Microsoft Entra ID SSO implementation with MSAL and backend validationfeat(task-504): implement real Microsoft Entra ID SSO with MSAL and backend token validation; cleanup duplicates; update README)

      useEffect(() => {
        passwordsMatch();
      }, [password, confirmPassword]);

<<<<<<< HEAD
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!accountType) {
      setError('Please select an account type');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    const name = `${firstName} ${lastName}`.trim();
    setIsSubmitting(true);
    const result = await authClient.signUp.email({
      name: name || 'New User',
      email,
      password,
      username,
      phone,
      accountType,
    });
    setIsSubmitting(false);

    if (result?.error) {
      const fallback = result.error.status
        ? `Sign up failed (${result.error.status} ${result.error.statusText})`
        : 'Sign up failed. Please try again.';
      setError(result.error.message || fallback);
      return;
    }
    
    // Clear form
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setAccountType('');
    if (result?.data?.token === null) {
      setRegistered(true);
      return;
    }

    navigate('/home', { replace: true });
  };

  return (
    <div className="w-screen min-h-screen flex items-center justify-center bg-no-repeat bg-black py-4 sm:py-8 px-4 overflow-y-auto" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      {/* Main Registration Card - matching dashboard style - Mobile Responsive */}
      <div className="h-fit relative bg-white/30 backdrop-blur-md rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 w-full max-w-lg">
        {/* Title */}
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-black">Create Account</h1>
          <p className="text-xs sm:text-sm text-black mt-1">Sign up to get started</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {/* Name Row - Stack on mobile, side-by-side on larger screens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="firstName" className="block text-sm font-semibold text-black mb-1">
                First Name
              </label>
              <input
                className="w-full px-4 py-2 bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                type="text"
                id="firstName"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-semibold text-black mb-1">
                Last Name
              </label>
              <input
                className="w-full px-4 py-2 bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                type="text"
                id="lastName"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-black mb-1">
              Username
            </label>
            <input
              className="w-full px-4 py-2 bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              type="text"
              id="username"
              placeholder="johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-black mb-1">
              Email
            </label>
            <input
              className="w-full px-4 py-2 bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              type="email"
              id="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm  font-semibold  text-black mb-1">
              Phone Number
            </label>
            <input
              className="w-full px-4 py-2 bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              type="tel"
              id="phone"
              placeholder="(555) 123-4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          {/* Password Row - Stack on mobile, side-by-side on larger screens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="password" className="block text-sm  font-semibold  text-black mb-1">
                Password
              </label>
              <input
                className="w-full px-4 py-2 bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                type="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-black mb-1">
                Confirm Password
              </label>
              <input
                className={`w-full px-4 py-2 bg-white text-gray-900 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  !passwordMatch && confirmPassword 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                }`}
                type="password"
                id="confirmPassword"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>
          
          {/* Password match indicator */}
          {!passwordMatch && confirmPassword && (
            <p className="text-xs text-red-600">Passwords do not match</p>
          )}

          {/* Account Type */}
          <div>
            <label htmlFor="accountType" className="block text-sm font-semibold text-black mb-1">
              Account Type
            </label>
            <select
              className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              id="accountType"
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              required
            >
              <option value="">Select Account Type</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="monitoring">Monitor Only</option>
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>

          {/* Login Link */}
          <div className="text-center text-sm text-black">
            Already have an account?{' '}
            <Link 
              className="text-blue-600 font-semibold hover:text-blue-700 hover:underline" 
              to="/"
            >
              Login Here
            </Link>
          </div>
        </form>
=======
      const passwordsMatch = () => {
        if (password !== confirmPassword) {
          loginStatus = 'Passwords do not match';
          setBorderColor('border-red-500');
        } else {
          loginStatus = '';
        }
      };

      if (loggedIn) {
        return <Home />;
      }
      
      const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here (e.g., send credentials to an API)
        console.log('Username:', username, 'Password:', password);
        loggedIn = true; // Update loggedIn status upon successful login
        setUsername('');
        setPassword('');
      };

      const handleSignUp = (e) => {
        e.preventDefault(); 
        // Handle sign-up logic here (e.g., send credentials to an API)
        console.log('Sign Up - Username:', username, 'Password:', password);
        <Register />;
        setUsername('');
        setPassword('');
      };

      return (
        <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-r to-blue-400 via-slate-300 from-red-400">
          <div className='absolute inset-0 bg-[url("./src/Components/assets/login_logo.png")] bg-no-repeat bg-center opacity-70'></div>
          <div className="p-2 bg-white shadow-xl backdrop-blur-sm border border-black space-y-4">
            <div className="flex flex-col items-center justify-center bg-transparent rounded-lg p-2">
              <h1 className='text-2xl font-bold mb-4'>Registration Form</h1>
              <form onSubmit={handleSubmit}>
                <div>
                  <label className='text-lg mb-2'>Name: </label>
                  <input 
                  className='p-1 rounded-lg border bg-transparent text-black borderColor m-1'
                  type="text"
                  id="firstName"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  />
                  <input 
                  className='p-1 rounded-lg border bg-transparent text-black transition-colors borderColor m-1'
                  type="text"
                  id="lastName"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  />
                </div>
                <div>
                <label className='text-lg mb-2'>Username: </label>
                  <input
                    className='p-1 rounded-lg border bg-transparent text-black border-gray-400 m-1'
                    type="text"
                    id="username"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className='text-lg mb-2'>Password: </label>
                  <input
                    className='p-1 rounded-lg border bg-transparent text-black border-gray-400 m-1'
                    type="password"
                    placeholder="Password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <input
                    className='p-1 rounded-lg border bg-transparent text-black border-gray-400 m-1'   
                    type="password"
                    placeholder="Confirm Password"
                    id="confirmPassword"
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />  
                </div>
                <div>
                  <label className='text-lg mb-2'>Email: </label>
                  <input 
                    className='p-1 rounded-lg border bg-transparent text-black border-gray-400 m-1'
                    type="email"
                    placeholder="Email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className='text-lg mb-2'>Phone: </label>
                  <input
                    className='p-1 rounded-lg border bg-transparent text-black border-gray-400 m-1'
                    type="tel"
                    placeholder="Phone Number"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div className='flex justify-center gap-2 m-2'>
                  <select
                    className='p-1 rounded-lg border text-black border-gray-400 m-1'
                    id="accountType"
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                  >
                    <option value="" >Select Account Type</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="monitoring">Monitor Only</option>
                  </select>
                </div>
                <div className='flex justify-center gap-2 m-2'>
                  <button type="submit" className='px-2 py-1 rounded-lg border border-gray-400 bg-blue-500 transition-all duration-500 ease-in-out hover:-translate-y-0.5 hover:scale-105 pointer-events-auto '>Sign Up</button>
                </div>
                <div className='flex text-xs justify-center m-2'>
                  <p>{loginStatus}</p>
                </div>
              </form>
            </div>
        </div>
>>>>>>> 41fbf86 (feat(task-504): cherry-pick real Microsoft Entra ID SSO implementation with MSAL and backend validationfeat(task-504): implement real Microsoft Entra ID SSO with MSAL and backend token validation; cleanup duplicates; update README)
      </div>
      );
    };

<<<<<<< HEAD
export default Register
=======
    export default Register;
>>>>>>> 41fbf86 (feat(task-504): cherry-pick real Microsoft Entra ID SSO implementation with MSAL and backend validationfeat(task-504): implement real Microsoft Entra ID SSO with MSAL and backend token validation; cleanup duplicates; update README)
