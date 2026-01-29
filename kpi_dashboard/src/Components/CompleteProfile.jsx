import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from './assets/sfd_bg.png';
import famarLogo from './assets/famar_logo.png';
import { authClient } from '../utils/authClient.js';

const DEFAULT_ACCOUNT_TYPE = 'monitoring';

const CompleteProfile = () => {
  const navigate = useNavigate();
  const { data: session, refetch: refetchSession } = authClient.useSession();
  const [displayName, setDisplayName] = useState('');
  const [displayEmail, setDisplayEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!session?.user) {
      navigate('/', { replace: true });
      return;
    }
    setDisplayName(session.user.name || '');
    setDisplayEmail(session.user.email || '');
    const existingUsername =
      session.user.username && session.user.username.startsWith('pending_')
        ? ''
        : session.user.username || '';
    const existingPhone =
      session.user.phone === '__pending__' ? '' : session.user.phone || '';
    setUsername(existingUsername);
    setPhone(existingPhone);
  }, [session?.user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !phone.trim()) {
      setError('Please provide both a username and phone number.');
      return;
    }

    setIsSubmitting(true);
    const result = await authClient.updateUser({
      username: username.trim(),
      phone: phone.trim(),
      accountType: DEFAULT_ACCOUNT_TYPE,
    });
    setIsSubmitting(false);

    if (result?.error) {
      const fallback = result.error.status
        ? `Update failed (${result.error.status} ${result.error.statusText})`
        : 'Update failed. Please try again.';
      setError(result.error.message || fallback);
      return;
    }

    await refetchSession?.();
    navigate('/home', { replace: true });
  };

  return (
    <div
      className="w-screen h-screen flex items-center justify-center bg-no-repeat bg-black p-1"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="flex items-center md:flex-row bg-gray-100 rounded-2xl shadow-lg overflow-hidden max-w-2xl w-fit h-fit p-2 bg-transparent">
        <div className="backdrop-blur-md bg-white/30 rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 w-auto max-w-md space-y-4 sm:space-y-6">
          <div className="flex justify-center">
            <img
              src={famarLogo}
              alt="Famar Logo"
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
            />
          </div>

          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-black">Complete Your Profile</h1>
            <p className="text-xs sm:text-sm text-gray-800 mt-1">
              You will be assigned as Viewer. For further access, please contact an admin.
            </p>
            <p className="text-[11px] sm:text-xs text-gray-700 mt-2">
              Name and Email imported from Microsoft SSO.
            </p>
          </div>

          {(!username.trim() || !phone.trim()) && (
            <div className="px-3 py-2 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs sm:text-sm">
              Required: Please enter both a username and phone number to continue.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-black mb-1">
                Name
              </label>
              <input
                className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 cursor-not-allowed"
                type="text"
                id="name"
                value={displayName}
                readOnly
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-black mb-1">
                Email
              </label>
              <input
                className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 cursor-not-allowed"
                type="email"
                id="email"
                value={displayEmail}
                readOnly
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-black mb-1">
                Username
              </label>
              <input
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                type="text"
                id="username"
                placeholder="yourname"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-black mb-1">
                Phone Number
              </label>
              <input
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                type="tel"
                id="phone"
                placeholder="(555) 123-4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save & Continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;
