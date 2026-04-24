import React, { useEffect, useRef, useState } from 'react'
import accountIcon from './assets/account.png'
import { authClient } from '../utils/authClient.js'
import { markManualLogout } from '../utils/manualLogoutFlag.js'

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
  };

  return (
    <div className="relative z-40" ref={menuRef}>
      <div 
        onClick={() => setOpen(!open)}
        className="h-10 p-2 bg-blue-500/40 hover:text-blue-800 hover:bg-white text-white cursor-pointer rounded-full flex flex-row items-center justify-center transition-all duration-500 ease-in-out hover:-translate-y-1 hover:scale-110 shrink shadow-blue-500/20 shadow-md w-fit"
        >
          <img src={avatarSrc} alt="Account Icon" className='inline w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 sm:mr-2 rounded-full object-cover'/>
          <span className="hidden md:inline text-sm truncate max-w-[120px]">{displayName}</span>
        </div>

        {open && (
          <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
            <button
              onClick={handleViewAccount}
              className="block w-full px-4 py-2 text-left hover:bg-blue-50"
              >
                View Account Details
              </button>

              <button
                onClick={async () => {
                  setOpen(false);
                  markManualLogout();
                  await authClient.signOut();
                }}
                className="block w-full px-4 py-2 text-left hover:bg-blue-50"
                >
                  Logout
                </button>
       </div>
      )}
    </div>
  );
};

export default User
