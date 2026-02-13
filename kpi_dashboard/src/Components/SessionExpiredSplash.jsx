import React from 'react'
import { useNavigate } from 'react-router-dom'

const SessionExpiredSplash = () => {
  const navigate = useNavigate()

  const handleSignIn = () => {
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded border bg-white p-6 text-center">
        <h1 className="text-xl font-semibold text-gray-900">Session Expired</h1>
        <p className="mt-2 text-sm text-gray-700">
          Your session has expired. Please sign in again.
        </p>
        <button
          type="button"
          onClick={handleSignIn}
          className="mt-4 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Sign In
        </button>
      </div>
    </div>
  )
}

export default SessionExpiredSplash
