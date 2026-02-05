import React from 'react'

const UnverifiedSplash = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl">
        <h1 className="text-2xl font-semibold text-slate-900">
          Account Created
        </h1>
        <p className="mt-3 text-slate-600">
          Your account has been successfully created and is awaiting access
          approval from an administrator.
        </p>
        <p className="mt-2 text-sm text-slate-500">
          You will be able to sign in once access is granted.
        </p>
        {/* TODO: Add action buttons, support links, and any status polling once logic is implemented. */}
      </div>
    </div>
  )
}

export default UnverifiedSplash
