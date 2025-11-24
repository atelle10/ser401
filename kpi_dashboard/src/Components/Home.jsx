import React, { useState } from 'react'
import NavBar from './NavBar.jsx'
import Sidebar from './Sidebar.jsx'
import Logo from './Logo.jsx'
import User from './User.jsx'
import Dashboard from './Dashboard.jsx'
import Upload from './Upload.jsx'
import Settings from './Settings.jsx'
import ChatBot from './ChatBot.jsx'
import famarLogo from './assets/famar_logo.png'

const Home = () => {
  const [currentView, setCurrentView] = useState('dashboard')

  const renderContent = () => {
    switch(currentView) {
      case 'dashboard':
        return <Dashboard />
      case 'upload':
        return <Upload />
      case 'settings':
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  return(
      <div className="w-screen min-h-screen m-0 p-0 bg-gradient-to-r to-blue-400 via-slate-300 from-red-400 overflow-x-hidden">
        {/* Mobile: Stack vertically, Desktop: Side-by-side grid */}
        <div className="h-full flex flex-col lg:grid lg:grid-cols-7 gap-0.5 p-2 sm:p-3 md:p-4">
          {/* Sidebar Column - Hidden on mobile, visible on lg+ */}
          <div className="hidden lg:flex lg:col-span-1 flex-col gap-2">
            <Logo />
            <div className="flex flex-col gap-2">
              <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
              <ChatBot />
            </div>
          </div>
          
          {/* Main Content Column */}
          <div className="flex-1 lg:col-span-6 flex flex-col gap-0">
            {/* Top Bar with Logo (mobile only), NavBar, and User */}
            <div className="flex items-center w-full gap-2">
              {/* Mobile Logo - Smaller version */}
              <div className="lg:hidden flex-shrink-0">
                <div className="bg-white rounded-xl shadow-md p-1">
                  <img src={famarLogo} alt="Logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
                </div>
              </div>
              
              {/* NavBar */}
              <div className="flex-1 min-w-0 pl-[6px]">
                <NavBar currentView={currentView} setCurrentView={setCurrentView} />
              </div>
              
              {/* User */}
              <div className="flex-shrink-0">
                <User />
              </div>
            </div>
            
            {/* Content Area - Page scrolls (no inner scroll) */}
            <div className="flex-1">
              {renderContent()}
            </div>
            
            {/* Mobile Bottom Navigation (Sidebar items) */}
            <div className="lg:hidden mt-auto">
              <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
            </div>
          </div>
        </div>
      </div>
  )
};

  export default Home;