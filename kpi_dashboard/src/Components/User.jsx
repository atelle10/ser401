import React, { useState, useRef, useEffect } from 'react';
import accountIcon from './assets/account.png';
import { authClient } from '../utils/authClient.js';

const User = ({ onViewAccount, profile }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const displayName = profile?.name || profile?.email || 'User';
  const avatarSrc = profile?.avatar || accountIcon;

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleViewAccount = () => {
    setOpen(false);
    if (onViewAccount) onViewAccount();
    // Placeholder — replace with actual account modal/route later
    alert('Account details coming soon');
  };

  const performLogout = async () => {
    setOpen(false);
    await authClient.signOut(); // Better Auth secure logout
  };

  return (
    <div className="relative" ref={menuRef}>
      <div
        onClick={() => setOpen(!open)}
        className="h-10 p-2 bg-blue-500/40 hover:text-blue-800 hover:bg-white text-white cursor-pointer rounded-full flex flex-row items-center justify-center transition-all duration-500 ease-in-out hover:-translate-y-1 hover:scale-110 shrink shadow-blue-500/20 shadow-md w-fit"
      >
        <img
          src={avatarSrc}
          alt="Account Icon"
          className=" 

inline w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 sm:mr-2 rounded-full object-cover"
        />
        <span className="hidden md:inline text-sm truncate max-w-[120px]">{displayName}</span>
      </div>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 animate-fade-in z-50">
          <button
            onClick={handleViewAccount}
            className="block w-full text-left px-4 py-2 hover:bg-blue-500/40 text-sm"
          >
            View Account Details
          </button>
          <button
            onClick={performLogout}
            className="block w-full text-left px-4 py-2 hover:bg-red-50 text-sm text-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default User;