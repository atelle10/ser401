import React from 'react';
import { useMsal } from '@azure/msal-react';  // Import for real MSAL logout
import NavBar from './NavBar.jsx';
import Sidebar from './Sidebar.jsx';
import Logo from './Logo.jsx';
import User from './User.jsx';
import Dashboard from './Dashboard.jsx';
import ChatBot from './ChatBot.jsx';

const Home = () => {
  const { instance } = useMsal();  // Get MSAL instance

  const handleLogout = () => {
    localStorage.removeItem("token");  // Clear JWT
    instance.logoutRedirect({  // ← Real MSAL logout (clears Microsoft session)
      postLogoutRedirectUri: window.location.origin
    });
  };

  return (
    <div className="min-w-6xl h-screen m-2 p-2 bg-gradient-to-r to-blue-400 via-slate-300 from-red-400 rounded-3xl shadow-lg grid grid-cols-7 gap-1">
      <div className="col-span-1 flex flex-col gap-2">
        <Logo />
        <div className="flex flex-col gap-2">
          <Sidebar />
          <ChatBot />
        </div>
      </div>
      <div className="col-span-6 flex flex-col gap-0 h-full">
        <div className="flex items-center w-full gap-2">
          <div className="flex-1 pl-[6px]">
            <NavBar />
          </div>
          <User handleLogout={handleLogout} />  {/* Pass the updated handler */}
        </div>
        <Dashboard className="flex-1 overflow-auto" />
      </div>
    </div>
  );
};

export default Home;
