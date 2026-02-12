import React, { useEffect, useState } from 'react';
import fireBackground from './assets/fire_background.png';
import accountIcon from './assets/account.png';
import { authClient } from '../utils/authClient.js';

const fallbackProfile = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'User',
  avatar: null, 
};

const Account = ({ onBack, profile = fallbackProfile, onUpdateProfile }) => {
  const { refetch: refetchSession } = authClient.useSession();
  const [formData, setFormData] = useState(profile);
  const [editing, setEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveNotice, setSaveNotice] = useState('');
  const maxAvatarBytes = 5 * 1024 * 1024;

  useEffect(() => {
    setFormData(profile || fallbackProfile);
    setEditing(false);
    setHasChanges(false);
    setSaveError('');
    setSaveNotice('');
  }, [profile]);

  const normalizeAvatar = (value) => value || '';

  const isDirty = (data) => {
    const base = profile || fallbackProfile;
    const baseAvatar = normalizeAvatar(base?.avatar);
    const currentAvatar = normalizeAvatar(data?.avatar);
    return (
      data?.name !== base?.name ||
      data?.email !== base?.email ||
      currentAvatar !== baseAvatar
    );
  };

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      setHasChanges(isDirty(updated));
      return updated;
    });
  };

  const handleAvatarChange = (e) => {
    if (!editing) return;
    const file = e.target.files?.[0];
    if (!file) return;
    setSaveError('');

    if (!file.type.startsWith('image/')) {
      setSaveError('Please choose a valid image file.');
      return;
    }

    if (file.size > maxAvatarBytes) {
      setSaveError('Image too large. Please use a file under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = typeof reader.result === 'string' ? reader.result : '';
      if (!imageUrl) {
        setSaveError('Unable to read image file.');
        return;
      }
      setFormData((prev) => {
        const updated = { ...prev, avatar: imageUrl };
        setHasChanges(isDirty(updated));
        return updated;
      });
    };
    reader.onerror = () => setSaveError('Unable to read image file.');
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    if (!editing) return;
    setFormData((prev) => {
      const updated = { ...prev, avatar: null };
      setHasChanges(isDirty(updated));
      return updated;
    });
  };

  const handleSave = async () => {
    if (!editing || !hasChanges || isSaving) return;
    setSaveError('');
    setSaveNotice('');
    setIsSaving(true);

    const base = profile || fallbackProfile;
    const baseAvatar = normalizeAvatar(base?.avatar);
    const name = formData?.name?.trim() || '';
    const email = formData?.email?.trim() || '';
    const avatar = normalizeAvatar(formData?.avatar);
    const nameChanged = name !== (base?.name || '');
    const emailChanged = email !== (base?.email || '');
    const avatarChanged = avatar !== baseAvatar;

    if (emailChanged && !email) {
      setSaveError('Please enter a valid email address.');
      setIsSaving(false);
      return;
    }

    const updatePayload = {};
    if (nameChanged) updatePayload.name = name;
    if (avatarChanged) updatePayload.image = avatar ? avatar : null;

    let shouldRefetch = false;
    if (Object.keys(updatePayload).length > 0) {
      const result = await authClient.updateUser(updatePayload);
      if (result?.error) {
        const fallback = result.error.status
          ? `Update failed (${result.error.status} ${result.error.statusText})`
          : 'Update failed. Please try again.';
        setSaveError(result.error.message || fallback);
        setIsSaving(false);
        return;
      }
      shouldRefetch = true;
    }

    if (emailChanged) {
      const callbackURL = `${window.location.origin}/home`;
      const result = await authClient.changeEmail({ newEmail: email, callbackURL });
      if (result?.error) {
        const fallback = result.error.status
          ? `Email update failed (${result.error.status} ${result.error.statusText})`
          : 'Email update failed. Please try again.';
        setSaveError(result.error.message || fallback);
        setIsSaving(false);
        return;
      }
      setSaveNotice('Email update requested. Check your inbox to verify the new address.');
    }

    if (shouldRefetch) {
      await refetchSession?.();
    }

    if (onUpdateProfile) {
      onUpdateProfile({ ...formData, name, email, avatar: avatar || '' });
    }

    setIsSaving(false);
    setEditing(false);
    setHasChanges(false);
  };

  const handleStartEditing = () => {
    setEditing(true);
    setHasChanges(false);
    setSaveError('');
    setSaveNotice('');
  };

  const handleCancel = () => {
    setEditing(false);
    setHasChanges(false);
    setFormData(profile || fallbackProfile);
    setSaveError('');
    setSaveNotice('');
  };

  const hasCustomAvatar = !!formData.avatar;

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat p-4"
      style={{ backgroundImage: `url(${fireBackground})` }}
    >
      <div className="absolute inset-0 bg-black/70"></div>

      <div className="relative z-10 bg-blue-950 rounded-3xl shadow-2xl p-10 w-full max-w-2xl border border-blue-800">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">Account Details</h1>
          {onBack && (
            <button
              onClick={onBack}
              className="px-6 py-3 bg-blue-900/70 hover:bg-blue-900 text-white font-medium rounded-lg shadow transition"
            >
              Back to Dashboard
            </button>
          )}
        </div>

        <div className="flex flex-col items-center mb-10">
          <img
            src={formData?.avatar || accountIcon}
            alt="Profile"
            className="w-32 h-32 rounded-full shadow-2xl object-cover border-4 border-blue-600"
          />
          {editing && (
            <div className="mt-4 flex gap-6 text-sm">
              <label className="text-blue-400 hover:text-blue-300 cursor-pointer hover:underline">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                Change photo
              </label>
              {hasCustomAvatar && (
                <button
                  onClick={handleRemoveAvatar}
                  className="text-red-400 hover:text-red-300 hover:underline"
                >
                  Remove photo
                </button>
              )}
            </div>
          )}
          <h2 className="text-2xl font-bold mt-4 text-white drop-shadow">{formData?.name}</h2>
          <p className="text-white/90 drop-shadow">{formData?.email}</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase text-white/70 mb-1">Name</label>
            <input
              type="text"
              value={formData?.name || ''}
              onChange={handleInputChange('name')}
              disabled={!editing}
              className="w-full px-4 py-3 bg-blue-900/40 border border-blue-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-white/50 disabled:bg-blue-900/30"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-white/70 mb-1">Email</label>
            <input
              type="email"
              value={formData?.email || ''}
              onChange={handleInputChange('email')}
              disabled={!editing}
              className="w-full px-4 py-3 bg-blue-900/40 border border-blue-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-white/50 disabled:bg-blue-900/30"
            />
            <p className="text-xs text-white/70 mt-1">
              Changing your email will send a verification link to the new address.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-white/70 mb-1">Role</label>
            <div className="w-full px-4 py-3 bg-blue-900/40 border border-blue-700 rounded-lg text-white/90">
              {formData?.role || 'User'}
            </div>
          </div>
        </div>

        {saveError && (
          <div className="mt-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-white">
            {saveError}
          </div>
        )}

        {saveNotice && (
          <div className="mt-6 p-4 bg-green-900/50 border border-green-700 rounded-lg text-white">
            {saveNotice}
          </div>
        )}

        <div className="mt-8 flex justify-end gap-4">
          {!editing && (
            <button
              onClick={handleStartEditing}
              className="text-blue-400 hover:text-blue-300 hover:underline font-medium"
            >
              Edit Details
            </button>
          )}

          {editing && (
            <>
              <button
                onClick={handleCancel}
                className="px-6 py-3 bg-red-900/80 hover:bg-red-800 text-white font-bold rounded-lg shadow transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
                className="px-6 py-3 bg-blue-800 hover:bg-blue-700 text-white font-bold rounded-lg shadow transition disabled:opacity-70"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;