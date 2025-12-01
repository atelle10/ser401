<<<<<<< HEAD
import React, { useEffect, useState } from 'react'
import { authClient } from '../utils/authClient';
=======
>>>>>>> 41fbf86 (feat(task-504): cherry-pick real Microsoft Entra ID SSO implementation with MSAL and backend validationfeat(task-504): implement real Microsoft Entra ID SSO with MSAL and backend token validation; cleanup duplicates; update README)
import NavBar from './NavBar.jsx'
import Sidebar from './Sidebar.jsx'
import Logo from './Logo.jsx'
import User from './User.jsx'
import Dashboard from './Dashboard.jsx'
import ChatBot from './ChatBot.jsx'
<<<<<<< HEAD
import famarLogo from './assets/famar_logo.png'
import Account from './Account.jsx';
import accountIcon from './assets/account.png'
import backgroundImage2 from './assets/background_img.png';

const fallbackProfile = {
  name: 'User',
  email: '',
  role: 'User',
  avatar: accountIcon,
}

const buildProfile = (user) => {
  if (!user) return fallbackProfile
  const name = user.name || user.username || user.email || fallbackProfile.name
  return {
    name,
    email: user.email || '',
    role: user.role || user.accountType || fallbackProfile.role,
    avatar: user.image || user.avatar || fallbackProfile.avatar,
  }
}

const Home = () => {
  const { data: session } = authClient.useSession()
  const [currentView, setCurrentView] = useState('dashboard')
  const [userProfile, setUserProfile] = useState(() => buildProfile(session?.user))

  useEffect(() => {
    setUserProfile(buildProfile(session?.user))
  }, [session?.user])
=======

const Home = ({ setIsAuthenticated }) => {
  const handleLogout = () => {
    console.log('handleLogout executed!');  // Log to confirm call
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    window.location.href = "/";
  };
>>>>>>> 41fbf86 (feat(task-504): cherry-pick real Microsoft Entra ID SSO implementation with MSAL and backend validationfeat(task-504): implement real Microsoft Entra ID SSO with MSAL and backend token validation; cleanup duplicates; update README)

  console.log('Home rendered, passing handleLogout to User');  // Log pass

  return(
<<<<<<< HEAD
      <div className="w-screen min-h-screen m-0 p-0 bg-blue-950 bg-no-repeat bg-cover flex items-center justify-center">
        {/* Mobile: Stack vertically, Desktop: Side-by-side grid */}
        <div className="h-full flex flex-col lg:grid lg:grid-cols-7 gap-0.5 p-2 sm:p-3 md:p-4">
          {/* Sidebar Column - Hidden on mobile, visible on lg+ */}
          <div className="hidden lg:flex lg:col-span-1 flex-col gap-2">
            <Logo />
            <div className="flex flex-col gap-2">
              <Sidebar currentView={currentView} setCurrentView={setCurrentView} onAccountClick={() => setCurrentView('account')} />
              <ChatBot />
=======
      <div className="min-w-6xl h-screen m-2 p-2 bg-gradient-to-r to-blue-400 via-slate-300 from-red-400 rounded-3xl shadow-lg grid grid-cols-7 gap-1">
            <div className="col-span-1 flex flex-col gap-2">
              <Logo />
              <div className="flex flex-col gap-2">
                <Sidebar />
                <ChatBot />
              </div>
>>>>>>> 41fbf86 (feat(task-504): cherry-pick real Microsoft Entra ID SSO implementation with MSAL and backend validationfeat(task-504): implement real Microsoft Entra ID SSO with MSAL and backend token validation; cleanup duplicates; update README)
            </div>
            <div className="col-span-6 flex flex-col gap-0 h-full">
              <div className="flex items-center w-full gap-2">
                <div className="flex-1 pl-[6px]">
                  <NavBar />
                </div>
                <User handleLogout={handleLogout} />  {/* Ensure passed */}
              </div>
<<<<<<< HEAD
              
              {/* NavBar */}
              <div className="flex-1 min-w-0 pl-[6px]">
                <NavBar currentView={currentView} setCurrentView={setCurrentView} />
              </div>
              
              {/* User */}
              <div className="flex-shrink-0">
                <User
                  profile={userProfile}
                  onViewAccount={() => setCurrentView('account')}
                />
              </div>
            </div>
            
            {/* Content Area - Page scrolls (no inner scroll) */}
            <div className="flex-1">
              {renderContent()}
            </div>
            
            {/* Mobile Bottom Navigation (Sidebar items) */}
            <div className="lg:hidden mt-auto self-center">
              <Sidebar currentView={currentView} setCurrentView={setCurrentView} onAccountClick={() => setCurrentView('account')} />
=======
              <Dashboard className="flex-1 overflow-auto" />
>>>>>>> 41fbf86 (feat(task-504): cherry-pick real Microsoft Entra ID SSO implementation with MSAL and backend validationfeat(task-504): implement real Microsoft Entra ID SSO with MSAL and backend token validation; cleanup duplicates; update README)
            </div>
          </div>
  )
};

export default Home;
