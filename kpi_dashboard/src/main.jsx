import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import NavBar from './Components/NavBar.jsx'
import Sidebar from './Components/Sidebar.jsx'
import Logo from './Components/Logo.jsx'
import User from './Components/User.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode >
      <div className="min-w-6xl min-h-[720px] m-2 p-2 bg-gray-200 rounded-3xl shadow-lg grid grid-cols-8 gap-1 grid-rows-auto">
        <div className="col-span-1 flex h-2 mb-2">
          <Logo />
        </div>
        <div className="col-span-6 flex justify-center h-2">
          <NavBar />
        </div>
        <div className="col-span-1 flex justify-end h-2">
          <User />
        </div>
        <div className="col-span-1 flex rounded-2xl">
          <Sidebar />
        </div>
        <div className="col-span-6 row-span-5 border-gray-300 p-2 rounded-2xl bg-white">
          {/* Main content goes here */}
        </div>
      </div>
    </StrictMode>,
)
