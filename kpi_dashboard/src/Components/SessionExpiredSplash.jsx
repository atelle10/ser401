import React from 'react'

const SessionExpiredSplash = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded border bg-white p-6 text-center">
        <h1 className="text-xl font-semibold text-gray-900">Session Expired</h1>
        <p className="mt-2 text-sm text-gray-700">
          Your session has expired. Please sign in again.
        </p>
      </div>
    </div>
  )
}

export default SessionExpiredSplash
