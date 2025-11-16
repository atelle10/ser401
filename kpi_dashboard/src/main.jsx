import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import NavBar from './Components/NavBar.jsx'
import Sidebar from './Components/Sidebar.jsx'
import Logo from './Components/Logo.jsx'
import User from './Components/User.jsx'
import Dashboard from './Components/Dashboard.jsx'
import ChatBot from './Components/ChatBot.jsx'
import Home from './Components/Home.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode >
      <Home />
    </StrictMode>,
)
