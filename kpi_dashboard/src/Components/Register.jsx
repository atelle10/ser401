import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authClient } from '../utils/authClient';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

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
    setFirstName('');
    setLastName('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setEmail('');
    setPhone('');
    setAccountType('');

    navigate('/home', { replace: true });
  };

  return (
    <div className="w-screen min-h-screen flex items-center justify-center bg-gradient-to-r to-blue-400 via-slate-300 from-red-400">
      <div className="p-2 bg-white shadow-xl backdrop-blur-sm border border-black space-y-4">
        <div className="flex flex-col items-center justify-center bg-transparent rounded-lg p-2">
          <h1 className='text-2xl font-bold mb-4'>Registration Form</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <label className='text-lg mb-2'>Name: </label>
              <input
                className='p-1 rounded-lg border bg-transparent text-black border-gray-400 m-1'
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <input
                className='p-1 rounded-lg border bg-transparent text-black transition-colors border-gray-400 m-1'
                type="text"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                className='p-1 rounded-lg border bg-transparent text-black border-gray-400 m-1'
                type="password"
                placeholder="Confirm Password"
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                requiredimport React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authClient } from '../utils/authClient';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

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
    setFirstName('');
    setLastName('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setEmail('');
    setPhone('');
    setAccountType('');

    navigate('/home', { replace: true });
  };

  return (
    <div className="w-screen min-h-screen flex items-center justify-center bg-gradient-to-r to-blue-400 via-slate-300 from-red-400">
      <div className="p-2 bg-white shadow-xl backdrop-blur-sm border border-black space-y-4">
        <div className="flex flex-col items-center justify-center bg-transparent rounded-lg p-2">
          <h1 className='text-2xl font-bold mb-4'>Registration Form</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <label className='text-lg mb-2'>Name: </label>
              <input
                className='p-1 rounded-lg border bg-transparent text-black border-gray-400 m-1'
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <input
                className='p-1 rounded-lg border bg-transparent text-black transition-colors border-gray-400 m-1'
                type="text"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                className='p-1 rounded-lg border bg-transparent text-black border-gray-400 m-1'
                type="password"
                placeholder="Confirm Password"
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
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className='flex justify-center gap-2 m-2'>
              <select
                className='p-1 rounded-lg border text-black border-gray-400 m-1'
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
              >
                <option value="">Select Account Type</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="monitoring">Monitor Only</option>
              </select>
            </div>
            <div className='flex justify-center gap-2 m-2'>
              <button type="submit" className='px-2 py-1 rounded-lg border border-gray-400 bg-blue-500 transition-all duration-500 ease-in-out hover:-translate-y-0.5 hover:scale-105 pointer-events-auto '>Sign Up</button>
            </div>
            {error && <p className='text-red-500'>{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
              />
            </div>
            <div>
              <label className='text-lg mb-2'>Phone: </label>
              <input
                className='p-1 rounded-lg border bg-transparent text-black border-gray-400 m-1'
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className='flex justify-center gap-2 m-2'>
              <select
                className='p-1 rounded-lg border text-black border-gray-400 m-1'
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
              >
                <option value="">Select Account Type</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="monitoring">Monitor Only</option>
              </select>
            </div>
            <div className='flex justify-center gap-2 m-2'>
              <button type="submit" className='px-2 py-1 rounded-lg border border-gray-400 bg-blue-500 transition-all duration-500 ease-in-out hover:-translate-y-0.5 hover:scale-105 pointer-events-auto '>Sign Up</button>
            </div>
            {error && <p className='text-red-500'>{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;