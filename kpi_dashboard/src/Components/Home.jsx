import React, { useEffect, useState } from 'react'
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
import TVModeSettings from './TVModeSettings.jsx'
import { countUnverifiedUsers } from '../utils/userVerification'
import Fire_Display from './Fire_Display.jsx'
import homeIcon from './assets/home icon.png'

const fallbackProfile = {
  name: 'User',
  email: '',
  username: '',
  phone: '',
  role: 'viewer',
  verificationStatus: 'Verified',
  avatar: accountIcon,
}

const buildProfile = (user) => {
  if (!user) return fallbackProfile
  const name = user.name || user.username || user.email || fallbackProfile.name
  const username =
    user.username && !user.username.startsWith('pending_')
      ? user.username
      : ''
  const phone = user.phone && user.phone !== '__pending__' ? user.phone : ''
  return {
    name,
    email: user.email || '',
    username,
    phone,
    role: user.role || fallbackProfile.role,
    verificationStatus: user.verified === false ? 'Pending approval' : 'Verified',
    avatar: user.image || user.avatar || fallbackProfile.avatar,
  }
}

const Home = ({ role = "admin" }) => {  
  const { data: session } = authClient.useSession()
  const [currentView, setCurrentView] = useState('dashboard')
  const [userProfile, setUserProfile] = useState(() => buildProfile(session?.user))
  const [adminNotificationCount, setAdminNotificationCount] = useState(0)
  const [isUnverifiedBannerDismissed, setIsUnverifiedBannerDismissed] = useState(false)
  const isAdmin = role === "admin"
  const [displayMode, setDisplayMode] = useState(false) 
  const [settings, setSettings] = useState('');
  const [metrics, setMetrics] = useState({
    region: null,
    window: 7,
    startDate: null,
    endDate: null,
    selectedCharts: [],
  })

  const refreshPage = () => {
    window.location.reload();
  };

  useEffect(() => {
    setUserProfile(buildProfile(session?.user))
  }, [session?.user])

  useEffect(() => {
    if (!isAdmin && ['admin', 'settings', 'tv-mode-settings'].includes(currentView)) {
      setCurrentView('dashboard')
    }
  }, [currentView, isAdmin])

  useEffect(() => {
    if (adminNotificationCount === 0) {
      setIsUnverifiedBannerDismissed(false)
    }
  }, [adminNotificationCount])

  useEffect(() => {
    let isMounted = true

    const loadAdminNotificationCount = async () => {
      if (!isAdmin) {
        if (isMounted) setAdminNotificationCount(0)
        return
      }

      const result = await authClient.admin.listUsers()
      if (!isMounted) return

      if (result?.error) {
        setAdminNotificationCount(0)
        return
      }

      setAdminNotificationCount(countUnverifiedUsers(result?.data?.users || []))
    }

    loadAdminNotificationCount()

    return () => {
      isMounted = false
    }
  }, [isAdmin])

  const renderContent = () => {
    switch(currentView) {
      case 'dashboard':
        return <Dashboard role={role} />
      case 'fire':
        return 
      case 'medical':
        return 
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
        return <Settings onOpenTVMode={() => setCurrentView('tv-mode-settings')} />
      case 'tv-mode-settings':
        if (!isAdmin) {
          return <div className="p-8 text-center text-red-600">Access Denied — TV mode settings for admin only</div>
        }
        return <TVModeSettings onBack={() => setCurrentView('settings')} setParentSettings={setSettings} />
      case 'admin':
        if (!isAdmin) {
          return <div className="p-8 text-center text-red-600">Access Denied — Admin console for admin only</div>
        }
        return <AdminMenu onUnverifiedCountChange={setAdminNotificationCount} />
      default:
        return <Dashboard role={role} setMetrics={setMetrics} />
    }
  }

  return(
      <div className="w-screen min-h-screen m-0 p-0 bg-blue-950 bg-no-repeat bg-cover flex items-start justify-start">
        {!displayMode && (
        <div className="h-full flex flex-col lg:grid lg:grid-cols-7 gap-0.5 p-0 sm:p-3 md:p-4">
              <div className="hidden lg:flex lg:col-span-1 flex-col gap-2">
                <Logo />
                <div className="flex flex-col gap-2">
                  <Sidebar
                    currentView={currentView}
                    setCurrentView={setCurrentView}
                    setDisplayMode={setDisplayMode}
                    onAccountClick={() => setCurrentView('account')}
                    isAdmin={isAdmin}
                    adminNotificationCount={adminNotificationCount}
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
                  <NavBar currentView={currentView} setCurrentView={setCurrentView} role={role} setDisplayMode={setDisplayMode} />
                </div>
                
                <div className="flex-shrink-0">
                  <User
                    profile={userProfile}
                    onViewAccount={() => setCurrentView('account')}
                  />
                </div>
              </div>

              {isAdmin && adminNotificationCount > 0 && !isUnverifiedBannerDismissed && (
                <div className="mx-1 mt-2 flex items-start justify-between gap-3 rounded-lg border border-yellow-200/70 bg-red-500/75 px-3 py-2 text-sm font-medium text-yellow-50 shadow-md">
                  <p>You have unverified users waiting for review.</p>
                  <button
                    type="button"
                    aria-label="Dismiss unverified users notification"
                    className="rounded px-1 text-yellow-100 hover:bg-red-600/70 hover:text-white transition"
                    onClick={() => setIsUnverifiedBannerDismissed(true)}
                  >
                    X
                  </button>
                </div>
              )}
              
              <div className="flex-1">
                {renderContent()}
              </div>
              
              <div className="lg:hidden mt-auto self-center">
                <Sidebar
                  currentView={currentView}
                  setCurrentView={setCurrentView}
                  setDisplayMode={setDisplayMode}
                  onAccountClick={() => setCurrentView('account')}
                  isAdmin={isAdmin}
                  adminNotificationCount={adminNotificationCount}
                  role={role}
                />
              </div>
            </div>
          </div>       
        )}
        {displayMode && currentView == 'fire' && (
          <div className="w-full h-full flex items-center justify-center p-4">
            <Fire_Display role={role} settings={settings} metrics={metrics} />
          </div>
        )}
        {displayMode && currentView === 'medical' && (
          <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div 
              className="ml-auto h-8 p-2 text-white hover:bg-white transition-all duration-500 ease-in-out hover:-translate-y-1 hover:scale-110 hover:text-blue-800 cursor-pointer rounded-full flex justify-center items-center my-1"
              onClick={refreshPage}
            >
              <img src={homeIcon} title='Return to Home' alt="Home Icon" className='w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7'/>
          </div>
            <div className="p-8 text-center text-gray-300">Medical module coming soon...</div>
          </div>
        )}
      </div>
  )
}

export default Home
