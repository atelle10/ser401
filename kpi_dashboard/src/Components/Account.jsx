import React, { useEffect, useState } from 'react';
import accountIcon from './assets/account.png'
import { authClient } from '../utils/authClient.js';

const fallbackProfile = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'User',
  avatar: accountIcon,
}

const Account = ({ onBack, profile = fallbackProfile, onUpdateProfile }) => {
  const [formData, setFormData] = useState(profile)
  const [editing, setEditing] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saveNotice, setSaveNotice] = useState('')
  // TODO: Wire save to backend profile endpoint (and avatar upload) in a later sprint.

  useEffect(() => {
    setFormData(profile || fallbackProfile)
    setEditing(false)
    setHasChanges(false)
    setSaveError('')
    setSaveNotice('')
  }, [profile])

  const isDirty = (data) => {
    const base = profile || fallbackProfile
    return (
      data?.name !== base?.name ||
      data?.email !== base?.email
    )
  }

  const handleInputChange = (field) => (e) => {
    const value = e.target.value
    setFormData((prev) => {
      const updated = { ...prev, [field]: value }
      setHasChanges(isDirty(updated))
      return updated
    })
  }

  const handleSave = async () => {
    if (!editing || !hasChanges || isSaving) return
    setSaveError('')
    setSaveNotice('')
    setIsSaving(true)

    const base = profile || fallbackProfile
    const name = formData?.name?.trim() || ''
    const email = formData?.email?.trim() || ''
    const nameChanged = name !== (base?.name || '')
    const emailChanged = email !== (base?.email || '')

    if (emailChanged && !email) {
      setSaveError('Please enter a valid email address.')
      setIsSaving(false)
      return
    }

    if (nameChanged) {
      const result = await authClient.updateUser({ name })
      if (result?.error) {
        const fallback = result.error.status
          ? `Update failed (${result.error.status} ${result.error.statusText})`
          : 'Update failed. Please try again.'
        setSaveError(result.error.message || fallback)
        setIsSaving(false)
        return
      }
    }

    if (emailChanged) {
      const callbackURL = `${window.location.origin}/home`
      const result = await authClient.changeEmail({ newEmail: email, callbackURL })
      if (result?.error) {
        const fallback = result.error.status
          ? `Email update failed (${result.error.status} ${result.error.statusText})`
          : 'Email update failed. Please try again.'
        setSaveError(result.error.message || fallback)
        setIsSaving(false)
        return
      }
      setSaveNotice('Email update requested. Check your inbox to verify the new address.')
    }

    if (onUpdateProfile) {
      onUpdateProfile({ ...formData, name, email })
    }

    setIsSaving(false)
    setEditing(false)
    setHasChanges(false)
  }

  const handleStartEditing = () => {
    setEditing(true)
    setHasChanges(false)
    setFormData(profile || fallbackProfile)
    setSaveError('')
    setSaveNotice('')
  }

  const handleCancel = () => {
    setEditing(false)
    setHasChanges(false)
    setFormData(profile || fallbackProfile)
    setSaveError('')
    setSaveNotice('')
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-xl border">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Account Details</h1>
          {onBack && (
            <button
              onClick={onBack}
              className="text-sm px-3 py-1 rounded-full border hover:bg-gray-100"
            >
              Back to Dashboard
            </button>
          )}
        </div>

        <div className="flex flex-col items-center mb-6">
          <img
            src={formData?.avatar || accountIcon}
            alt="Profile"
            className="w-20 h-20 rounded-full shadow mb-3 object-cover"
          />
          {editing && (
            <p className="text-xs text-gray-500">
              Profile photo updates aren&apos;t supported yet.
            </p>
          )}
          <h2 className="text-lg font-medium mt-2">{formData?.name}</h2>
          <p className="text-gray-600 text-sm">{formData?.email}</p>
        </div>

        <div className="space-y-4 w-full">
          <div>
            <h3 className="text-xs font-bold text-gray-600 uppercase">Name</h3>
            <input
              type="text"
              value={formData?.name || ''}
              onChange={handleInputChange('name')}
              className="border p-2 rounded-md mt-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-100"
              disabled={!editing}
            />
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-600 uppercase">Email</h3>
            <input
              type="email"
              value={formData?.email || ''}
              onChange={handleInputChange('email')}
              className="border p-2 rounded-md mt-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-100"
              disabled={!editing}
            />
            <p className="text-xs text-gray-500 mt-1">
              Changing your email will send a verification link to the new address.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-600 uppercase">Role</h3>
            <p className="border p-2 rounded-md mt-1 text-sm bg-gray-100 text-gray-600">
              {formData?.role || 'User'}
            </p>
          </div>

          {saveError && (
            <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {saveError}
            </div>
          )}

          {saveNotice && (
            <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-600">
              {saveNotice}
            </div>
          )}

          <div className="flex justify-end pt-2 gap-3">
            {!editing && (
              <button
                onClick={handleStartEditing}
                className="text-sm text-blue-600 hover:underline px-2 py-2"
              >
                Edit Details
              </button>
            )}

            {editing && (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition-colors"
                >
                  Cancel changes
                </button>
                {hasChanges && (
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save changes'}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
