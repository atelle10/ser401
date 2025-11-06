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
      <div className="min-w-6xl min-h-[720px] m-2 p-2 bg-gray-200 rounded-3xl shadow-lg grid grid-cols-7 gap-1">
        <div className="col-span-1 flex flex-col gap-0">
          <Logo />
          <Sidebar />
          <ChatBot />
        </div>
        <div className="col-span-6 flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <NavBar />
            <User />
          </div>
          <Dashboard />
        </div>
      </div>
    </StrictMode>,
)
