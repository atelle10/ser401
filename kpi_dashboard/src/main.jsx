import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import NavBar from './Components/NavBar/NavBar.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode >
    <NavBar />
  </StrictMode>,
)
