import React, { useState } from 'react';
import { useMsal } from '@azure/msal-react';

import NavBar from './NavBar.jsx';
import Sidebar from './Sidebar.jsx';
import Logo from './Logo.jsx';
import User from './User.jsx';
import Dashboard from './Dashboard.jsx';
import Upload from './Upload.jsx';
import Settings from './Settings.jsx';
import ChatBot from './ChatBot.jsx';
import Account from './Account.jsx';

import famarLogo from './assets/famar_logo.png';
import accountIcon from './assets/account.png';

const Home = () => {
  const { instance, accounts } = useMsal();
  const account = accounts[0] || {};

  // Extract role from MSAL claims (Azure app roles)
  const role = account.idTokenClaims?.roles?.[0] || 'viewer';

  const [currentView, setCurrentView] = useState('dashboard');

  const [userProfile, setUserProfile] = useState({
    name: account.name || account.username || 'John Doe',
    email: account.username || '',
    role: role.toUpperCase(),
    avatar: accountIcon,
  });

  const handleLogout = () => {
    instance.logoutRedirect({
      postLogoutRedirectUri: window.location.origin,
    });
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard role={role} />;
      case 'upload':
        return (role === 'admin' || role === 'analyst') ? <Upload /> : <Dashboard role={role} />;
      case 'account':
        return <Account profile={userProfile} onUpdateProfile={setUserProfile} onBack={() => setCurrentView('dashboard')} />;
      case 'settings':
        return role === 'admin' ? <Settings /> : <Dashboard role={role} />;
      default:
        return <Dashboard role={role} />;
    }
  };

  return (
    <div className="w-screen min-h-screen m-0 p-0 bg-gradient-to-r from-red-400 via-slate-300 to-blue-400 overflow-x-hidden">
      <div className="h-full flex flex-col lg:grid lg:grid-cols-7 gap-0.5 p-2 sm:p-3 md:p-4">

        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:col-span-1 flex-col gap-2">
          <Logo />
          <div className="flex flex-col gap-2">
            <Sidebar 
              role={role}
              currentView={currentView} 
              setCurrentView={setCurrentView} 
              onAccountClick={() => setCurrentView('account')} 
            />
            <ChatBot />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:col-span-6 flex flex-col gap-0">

          {/* Top NavBar */}
          <div className="flex items-center w-full gap-2">
            
            {/* Mobile Logo */}
            <div className="lg:hidden flex-shrink-0">
              <div className="bg-white rounded-xl shadow-md p-1">
                <img src={famarLogo} alt="Logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
              </div>
            </div>

            <div className="flex-1 min-w-0 pl-[6px]">
              <NavBar 
                role={role} 
                currentView={currentView} 
                setCurrentView={setCurrentView} 
              />
            </div>

            <div className="flex-shrink-0">
              <User 
                profile={userProfile} 
                onViewAccount={() => setCurrentView('account')} 
                handleLogout={handleLogout} 
              />
            </div>
          </div>

          {/* Page Content */}
          <div className="flex-1">
            {renderContent()}
          </div>

          {/* Mobile Sidebar */}
          <div className="lg:hidden mt-auto">
            <Sidebar 
              role={role}
              currentView={currentView} 
              setCurrentView={setCurrentView} 
              onAccountClick={() => setCurrentView('account')} 
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;
