import React from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Login from './Components/Login.jsx'
import Home from './Components/Home.jsx'
import Register from './Components/Register.jsx'
import CompleteProfile from './Components/CompleteProfile.jsx'
import UnverifiedSplash from './Components/UnverifiedSplash.jsx'
import SessionExpiredSplash from './Components/SessionExpiredSplash.jsx'
import { authClient } from './utils/authClient.js'

const needsProfileCompletion = (user) =>
  !user?.username ||
  !user?.phone ||
  !user?.role ||
  user.username.startsWith('pending_') ||
  user.phone === '__pending__'

const needsVerification = (user) => user?.verified === false

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

  if (needsProfileCompletion(session.user) && location.pathname !== '/complete-profile') {
    return <Navigate to="/complete-profile" replace />
  }

  if (
    needsVerification(session.user) &&
    location.pathname !== '/awaiting-access' &&
    location.pathname !== '/complete-profile'
  ) {
    return <Navigate to="/awaiting-access" replace />
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
    if (needsProfileCompletion(session.user)) {
      return <Navigate to="/complete-profile" replace />
    }
    if (needsVerification(session.user)) {
      return <Navigate to="/awaiting-access" replace />
    }
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
              path="/complete-profile"
              element={
                <RequireAuth>
                  <CompleteProfile />
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
            <Route path="/awaiting-access" element={<UnverifiedSplash />} />
            <Route path="/session-expired" element={<SessionExpiredSplash />} />
        </Routes>
    </div>
  )
}

export default App
