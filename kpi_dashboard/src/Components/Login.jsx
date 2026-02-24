import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import famarLogo from './assets/famar_logo.png';
import backgroundImage from './assets/sfd_bg.png';
import { authClient } from '../utils/authClient.js';

const Login = () => {
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (session?.user) {
      navigate('/home', { replace: true });
    }
  }, [session, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsSubmitting(true);
    const result = await authClient.signIn.email({ email, password });
    setIsSubmitting(false);

    if (result?.error) {
      const fallback = result.error.status
        ? `Sign in failed (${result.error.status} ${result.error.statusText})`
        : 'Sign in failed. Please try again.';
      setError(result.error.message || fallback);
      return;
    }

    if (result?.data?.redirect && result.data.url) {
      window.location.assign(result.data.url);
      return;
    }

    setEmail('');
    setPassword('');
    navigate('/home', { replace: true });
  };

  const handleMicrosoftSignIn = async () => {
    setError('');
    setIsSubmitting(true);
    const result = await authClient.signIn.social({
      provider: 'microsoft',
      callbackURL: '/home',
    });
    setIsSubmitting(false);

    if (result?.error) {
      const fallback = result.error.status
        ? `Microsoft sign in failed (${result.error.status} ${result.error.statusText})`
        : 'Microsoft sign in failed. Please try again.';
      setError(result.error.message || fallback);
      return;
    }

    if (result?.data?.redirect && result.data.url) {
      window.location.assign(result.data.url);
      return;
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-no-repeat bg-black p-1" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <div className="flex items-center md:flex-row rounded-2xl shadow-lg overflow-hidden max-w-4xl w-fit h-fit p-2 bg-transparent">
        <div className="bg-blue-950 rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 w-full max-w-md space-y-4 sm:space-y-6 border border-blue-800">
          <div className="flex justify-center">
            <img 
              src={famarLogo} 
              alt="Famar Logo" 
              className="w-24 h-24 sm:w-32 sm:h-32 object-contain" 
            />
          </div>
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-white">Welcome Back</h1>
            <p className="text-xs sm:text-sm text-white/80 mt-1">Sign in to continue to dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-1">
                Email
              </label>
              <input
                className="w-full px-4 py-2 bg-blue-900/40 text-white placeholder-white/50 border border-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
            />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-1">
                Password
              </label>
              <input
                className="w-full px-4 py-2 bg-blue-900/40 text-white placeholder-white/50 border border-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                type="password"
                placeholder="Enter your password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
            />
            </div>

            {error && (
              <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg">
                <p className="text-sm text-white">{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Login'}
            </button>

            <button 
              type="button" 
              className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              onClick={handleMicrosoftSignIn}
            disabled={isSubmitting}
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 23 23"
                aria-hidden="true"
                focusable="false"
              >
                <rect x="1" y="1" width="10" height="10" fill="#F25022" />
                <rect x="12" y="1" width="10" height="10" fill="#7FBA00" />
                <rect x="1" y="12" width="10" height="10" fill="#00A4EF" />
                <rect x="12" y="12" width="10" height="10" fill="#FFB900" />
              </svg>
              {isSubmitting ? 'Sending to Microsoft SSO...' : 'Sign in with Microsoft'}
            </button>

            <div className="text-center text-sm text-white/80">
              Don't have an account?{' '}
              <Link 
              className="text-blue-400 font-semibold hover:text-blue-300 hover:underline" 
                to="/register"
              >
                Register Here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
