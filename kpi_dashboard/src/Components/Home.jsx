import React, { useEffect, useMemo, useState } from 'react'
import { authClient } from '../utils/authClient'
import NavBar from './NavBar.jsx'
import Sidebar from './Sidebar.jsx'
import Logo from './Logo.jsx'
import User from './User.jsx'
import Dashboard from './Dashboard.jsx'
import Upload from './Upload.jsx'
import Settings from './Settings.jsx'
import ChatBot from './ChatBot.jsx'
import AdminMenu from './AdminMenu.jsx'
import famarLogo from './assets/famar_logo.png'
import Account from './Account.jsx'
import accountIcon from './assets/account.png'

const fallbackProfile = {
  name: 'User',
  email: '',
  role: 'viewer',
  avatar: accountIcon,
}

const buildProfile = (user) => {
  if (!user) return fallbackProfile
  const name = user.name || user.username || user.email || fallbackProfile.name
  return {
    name,
    email: user.email || '',
    role: user.role || fallbackProfile.role,
    avatar: user.image || user.avatar || fallbackProfile.avatar,
  }
}

const Home = ({ role = "viewer" }) => {  
  const { data: session } = authClient.useSession()
  const [currentView, setCurrentView] = useState('dashboard')
  const [userProfile, setUserProfile] = useState(() => buildProfile(session?.user))
  const isAdmin = role === "admin"

  useEffect(() => {
    setUserProfile(buildProfile(session?.user))
  }, [session?.user])

  useEffect(() => {
    if (!isAdmin && currentView === 'admin') {
      setCurrentView('dashboard')
    }
  }, [currentView, isAdmin])

  const renderContent = () => {
    switch(currentView) {
      case 'dashboard':
        return <Dashboard role={role} />
      case 'upload':
        if (!["analyst", "admin"].includes(role)) {
          return <div className="p-8 text-center text-red-600">Access Denied — Upload for analyst/admin only</div>
        }
        return <Upload />
      case 'account':
        return (
          <Account
            profile={userProfile}
            onUpdateProfile={setUserProfile}
            onBack={() => setCurrentView('dashboard')}
          />
        )
      case 'settings':
        if (role !== "admin") {
          return <div className="p-8 text-center text-red-600">Access Denied — Settings for admin only</div>
        }
        return <Settings />
      case 'admin':
        if (!isAdmin) {
          return <div className="p-8 text-center text-red-600">Access Denied — Admin console for admin only</div>
        }
        return <AdminMenu />
      default:
        return <Dashboard role={role} />
    }
  }

  return(
      <div className="w-screen min-h-screen m-0 p-0 bg-blue-950 bg-no-repeat bg-cover flex items-start justify-start">
        <div className="h-full flex flex-col lg:grid lg:grid-cols-7 gap-0.5 p-0 sm:p-3 md:p-4">
          <div className="hidden lg:flex lg:col-span-1 flex-col gap-2">
            <Logo />
            <div className="flex flex-col gap-2">
              <Sidebar
                currentView={currentView}
                setCurrentView={setCurrentView}
                onAccountClick={() => setCurrentView('account')}
                isAdmin={isAdmin}
                role={role}
              />
              <ChatBot />
            </div>
          </div>
          
          <div className="flex-1 lg:col-span-6 flex flex-col gap-0">
            <div className="flex items-center w-full gap-2">
              <div className="lg:hidden flex-shrink-0">
                <div className="bg-white rounded-xl shadow-md p-1">
                  <img src={famarLogo} alt="Logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0 pl-[6px]">
                <NavBar currentView={currentView} setCurrentView={setCurrentView} role={role} />
              </div>
              
              <div className="flex-shrink-0">
                <User
                  profile={userProfile}
                  onViewAccount={() => setCurrentView('account')}
                />
              </div>
            </div>
            
            <div className="flex-1">
              {renderContent()}
            </div>
            
            <div className="lg:hidden mt-auto self-center">
              <Sidebar
                currentView={currentView}
                setCurrentView={setCurrentView}
                onAccountClick={() => setCurrentView('account')}
                isAdmin={isAdmin}
                role={role}
              />
            </div>
          </div>
        </div>
      </div>
  )
}

export default Home
