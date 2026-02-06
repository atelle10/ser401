import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authClient } from '../utils/authClient.js'

const UnverifiedSplash = () => {
  const navigate = useNavigate()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    if (isSigningOut) return
    setIsSigningOut(true)
    await authClient.signOut()
    navigate('/', { replace: true })
  }

  return (
    <div className="w-screen min-h-screen flex items-center justify-center bg-blue-950 p-4">
      <div className="bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 sm:p-6 md:p-8 w-full max-w-md text-center space-y-4 sm:space-y-6 rounded-lg">
        <div className="flex justify-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/30 rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v5m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
              ></path>
            </svg>
          </div>
        </div>
        <h1 className="text-xl sm:text-2xl font-semibold text-white">
          Account Created
        </h1>
        <p className="text-white/90">
          Your account has been successfully created and is awaiting access
          approval from an administrator.
        </p>
        <p className="text-white/90 text-sm">
          You will be able to sign in once access is granted.
        </p>
        <div className="bg-blue-500/30 border border-blue-300/40 rounded-lg p-3">
          <p className="text-sm text-white">
            <strong>Status:</strong> Pending admin approval
          </p>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSigningOut ? 'Signing Out...' : 'Sign Out'}
        </button>
        {/* TODO: Wire this up to the backend to check if the account is verified */}
      </div>
    </div>
  )
}

export default UnverifiedSplash
