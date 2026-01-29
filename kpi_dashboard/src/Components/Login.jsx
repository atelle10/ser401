import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { authClient } from '../utils/authClient';
import famarLogo from './assets/famar_logo.png';
import backgroundImage from './assets/sfd_bg.png';
import backgroundImage2 from './assets/sfd_bg_2.jpg';
import sfdlogo from './assets/sfd_bg_2_transparentbg.png';


let loggedIn = false;

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
      <div className="flex items-center md:flex-row bg-gray-100 rounded-2xl shadow-lg overflow-hidden max-w-4xl w-fit h-fit p-2 bg-transparent">
        {/* Main Login Card - matching dashboard style - Mobile Responsive */}
        <div className="backdrop-blur-md bg-white/30 rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 h-1/2 w-auto max-w-md space-y-4 sm:space-y-6">
          {/* Logo */}
          <div className="flex justify-center">
            <img 
              src={famarLogo} 
              alt="Famar Logo" 
              className="w-24 h-24 sm:w-32 sm:h-32 object-contain" 
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              type="email"
              placeholder="Enter your email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>

            {/* Sign in with Microsoft Button */}
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

            {/* Register Link */}
            <div className="text-center text-sm text-black">
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
      </div>
    </div>
  );
};

export default Login;
