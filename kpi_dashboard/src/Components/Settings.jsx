import React, { useState, useEffect } from 'react'

export default function Settings() {
  const [settings, setSettings] = useState({
    theme: 'light',
    defaultView: 'dashboard',
    dateFormat: 'MM/DD/YYYY',
    timezone: 'America/Phoenix',
    emailNotifications: true,
    alertThreshold: 80,
    autoRefresh: true,
    refreshInterval: 300,
  })

  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('userSettings')
    if (stored) {
      try {
        setSettings(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to load settings:', e)
      }
    }
  }, [])

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  const handleSave = () => {
    localStorage.setItem('userSettings', JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleReset = () => {
    const defaults = {
      theme: 'light',
      defaultView: 'dashboard',
      dateFormat: 'MM/DD/YYYY',
      timezone: 'America/Phoenix',
      emailNotifications: true,
      alertThreshold: 80,
      autoRefresh: true,
      refreshInterval: 300,
    }
    setSettings(defaults)
    setSaved(false)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>

      <div className="bg-white rounded-lg shadow divide-y">
        {/* Display Settings */}
        <div className="p-6">
          <h2 className="font-medium text-lg mb-4">Display</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Theme</label>
              <select
                value={settings.theme}
                onChange={(e) => handleChange('theme', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Default View</label>
              <select
                value={settings.defaultView}
                onChange={(e) => handleChange('defaultView', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="dashboard">Dashboard</option>
                <option value="upload">Upload</option>
                <option value="reports">Reports</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Date Format</label>
              <select
                value={settings.dateFormat}
                onChange={(e) => handleChange('dateFormat', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Timezone</label>
              <select
                value={settings.timezone}
                onChange={(e) => handleChange('timezone', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="America/Phoenix">Arizona (MST)</option>
                <option value="America/Los_Angeles">Pacific (PST)</option>
                <option value="America/Denver">Mountain (MST)</option>
                <option value="America/Chicago">Central (CST)</option>
                <option value="America/New_York">Eastern (EST)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Settings */}
        <div className="p-6">
          <h2 className="font-medium text-lg mb-4">Data</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium">Auto Refresh</label>
                <p className="text-xs text-gray-600">Automatically update dashboard data</p>
              </div>
              <input
                type="checkbox"
                checked={settings.autoRefresh}
                onChange={(e) => handleChange('autoRefresh', e.target.checked)}
                className="w-4 h-4"
              />
            </div>

            {settings.autoRefresh && (
              <div>
                <label className="block text-sm font-medium mb-1">Refresh Interval (seconds)</label>
                <input
                  type="number"
                  min="60"
                  max="3600"
                  step="60"
                  value={settings.refreshInterval}
                  onChange={(e) => handleChange('refreshInterval', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            )}
          </div>
        </div>

        {/* Notification Settings */}
        <div className="p-6">
          <h2 className="font-medium text-lg mb-4">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium">Email Notifications</label>
                <p className="text-xs text-gray-600">Receive email alerts for critical events</p>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                className="w-4 h-4"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Alert Threshold (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={settings.alertThreshold}
                onChange={(e) => handleChange('alertThreshold', parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
              />
              <p className="text-xs text-gray-600 mt-1">
                Trigger alerts when utilization exceeds this threshold
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded border hover:bg-gray-50"
          >
            Reset to Defaults
          </button>
          <div className="flex items-center gap-3">
            {saved && (
              <span className="text-sm text-green-600">Saved successfully</span>
            )}
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
