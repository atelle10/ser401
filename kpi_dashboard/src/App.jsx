import React from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Login from './Components/Login.jsx'
import Home from './Components/Home.jsx'
import Register from './Components/Register.jsx'
import RequestSent from './Components/RequestSent.jsx'
import { authClient } from './utils/authClient.js'

const RequireAuth = ({ children }) => {
  const location = useLocation()
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Checking session...
      </div>
    )
  }

  if (!session?.user) {
    return <Navigate to="/" replace state={{ from: location }} />
  }

  return children
}

const RequireGuest = ({ children }) => {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Checking session...
      </div>
    )
  }

  if (session?.user) {
    return <Navigate to="/home" replace />
  }

  return children
}

function App() {
  return (
    <div className="App">
        <Routes>
            <Route
              path="/"
              element={
                <RequireGuest>
                  <Login />
                </RequireGuest>
              }
            />
            <Route
              path="/home"
              element={
                <RequireAuth>
                  <Home />
                </RequireAuth>
              }
            />
            <Route
              path="/register"
              element={
                <RequireGuest>
                  <Register />
                </RequireGuest>
              }
            />
            <Route path="/request-sent" element={<RequestSent />} />
        </Routes>
    </div>
  )
}

export default App
