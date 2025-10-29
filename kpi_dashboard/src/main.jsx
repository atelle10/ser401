import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import NavBar from './Components/NavBar.jsx'
import Sidebar from './Components/Sidebar.jsx'
import Logo from './Components/Logo.jsx'
import User from './Components/User.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode >
      <div className="min-h-screen m-2 p-2 bg-gray-200 rounded-3xl shadow-lg grid grid-cols-8 gap-1 grid-rows-6">
        <div className="col-span-1 flex justify-start">
          <Logo />
        </div>
        <div className="col-span-6">
          <NavBar />
        </div>
        <div className="col-span-1 flex justify-end">
          <User />
        </div>
        <div className="col-span-1 row-span-6">
          <Sidebar />
        </div>
        <div className="col-span-6">
          {/* Main content goes here */}
        </div>
      </div>
    </StrictMode>,
)
