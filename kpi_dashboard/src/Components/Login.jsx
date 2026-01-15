import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import famarLogo from './assets/famar_logo.png';
import backgroundImage from './assets/sfd_bg.jpg';
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

  return (
<<<<<<< HEAD
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
=======
    <div className="w-auto h-auto flex items-center justify-center bg-no-repeat bg-gray-500 p-1">
      <div className='rounded-lg h-full w-1/2 flex items-center justify-center overflow-hidden'>
        <img src={backgroundImage} alt="Login Logo" className="h-screen m-1" />
        <div className='absolute h-full w-full flex items-center justify-center '>
          <img src={sfdlogo} alt="SFD Logo" className="absolute m-1 inset-y-0 opacity-60" />
        </div>
      </div>
      
      {/* Main Login Card - matching dashboard style - Mobile Responsive */}
      <div className="relative bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 h-fit w-auto max-w-md space-y-4 sm:space-y-6">
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
>>>>>>> 28daf90 (UI change draft 1)
            />
          </div>

          {/* Title */}
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-black">Welcome Back</h1>
            <p className="text-xs sm:text-sm text-gray-800 mt-1">Sign in to continue to dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Input */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-black mb-1">
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
              <label htmlFor="password" className="block text-sm font-medium text-black mb-1">
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

          {/* Register Link */}
          <div className="text-center text-sm text-black">
            Don't have an account?{' '}
            <Link 
              className="text-blue-600 font-semibold hover:text-blue-700 hover:underline" 
              to="/register"
            >
              Login
            </Link>
          </div>

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
