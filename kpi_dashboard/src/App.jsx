import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './Components/Login.jsx'
import Home from './Components/Home.jsx'
import Register from './Components/Register.jsx'
import RequestSent from './Components/RequestSent.jsx'

function App() {
  return (
    <div className="App">
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/request-sent" element={<RequestSent />} />
        </Routes>
    </div>
  )
}

export default App