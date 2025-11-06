import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import NavBar from './Components/NavBar.jsx'
import Sidebar from './Components/Sidebar.jsx'
import Logo from './Components/Logo.jsx'
import User from './Components/User.jsx'
import Dashboard from './Components/Dashboard.jsx'
import ChatBot from './Components/ChatBot.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode >
      <div className="min-w-6xl h-screen m-2 p-2 bg-gray-200 rounded-3xl shadow-lg grid grid-cols-7 gap-1">
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
            <User />
          </div>
          <Dashboard className="flex-1 overflow-auto" />
        </div>
      </div>
    </StrictMode>,
)
