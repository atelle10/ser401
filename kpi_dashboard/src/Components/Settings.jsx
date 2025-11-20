import { useState, useEffect } from 'react';

const Settings = () => {
  // Load from localStorage - simpler than backend for user prefs
  const loadSettings = () => {
    try {
      const saved = localStorage.getItem('famar_settings');
      return saved ? JSON.parse(saved) : getDefaultSettings();
    } catch {
      return getDefaultSettings();
    }
  };

  const getDefaultSettings = () => ({
    theme: 'light',
    defaultView: 'dashboard',
    dateFormat: 'MM/DD/YYYY',
    timezone: 'America/Phoenix', // Scottsdale is always MST
    emailNotifications: true,
    alertTypes: ['critical', 'warning'],
    reportDelivery: 'daily',
    defaultChartType: 'bar',
    colorScheme: 'default',
    refreshInterval: 30,
    numberFormat: 'us',
    defaultRegion: 'all'
  });

  const [settings, setSettings] = useState(loadSettings());
  const [hasChanges, setHasChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState(''); // '', 'saving', 'saved', 'error'

  const updateSetting = (key, value) => {
    setSettings(prev => ({...prev, [key]: value}));
    setHasChanges(true);
    setSaveStatus('');
  };

  const saveSettings = () => {
    setSaveStatus('saving');
    try {
      localStorage.setItem('famar_settings', JSON.stringify(settings));
      // In production, would also POST to /api/user/settings
      setTimeout(() => {
        setSaveStatus('saved');
        setHasChanges(false);
        setTimeout(() => setSaveStatus(''), 2000);
      }, 300);
    } catch (err) {
      setSaveStatus('error');
    }
  };

  const resetToDefaults = () => {
    if (!confirm('Reset all settings to defaults?')) return;
    const defaults = getDefaultSettings();
    setSettings(defaults);
    setHasChanges(true);
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
          <p className="text-sm text-gray-600 mt-1">
            Customize your FAMAR dashboard experience
          </p>
        </div>
        {hasChanges && (
          <span className="text-sm text-orange-600 font-medium">Unsaved changes</span>
        )}
      </div>

      <div className="space-y-6">
        {/* Display Preferences */}
        <section className="border-b pb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Display</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Theme</label>
                <p className="text-xs text-gray-500">Light mode only - dark mode causes readability issues on station TVs</p>
              </div>
              <select 
                value={settings.theme}
                onChange={(e) => updateSetting('theme', e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                disabled
              >
                <option value="light">Light</option>
                <option value="dark">Dark (Coming Soon)</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Default View</label>
                <p className="text-xs text-gray-500">Page to show after login</p>
              </div>
              <select 
                value={settings.defaultView}
                onChange={(e) => updateSetting('defaultView', e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
              >
                <option value="dashboard">Dashboard</option>
                <option value="fire">Fire Incidents</option>
                <option value="medical">Medical Incidents</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Date Format</label>
                <p className="text-xs text-gray-500">How dates are displayed throughout the app</p>
              </div>
              <select 
                value={settings.dateFormat}
                onChange={(e) => updateSetting('dateFormat', e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Timezone</label>
                <p className="text-xs text-gray-500">Scottsdale doesn't observe DST</p>
              </div>
              <select 
                value={settings.timezone}
                onChange={(e) => updateSetting('timezone', e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
              >
                <option value="America/Phoenix">MST (Arizona)</option>
                <option value="America/Los_Angeles">Pacific</option>
                <option value="America/Denver">Mountain</option>
                <option value="America/Chicago">Central</option>
                <option value="America/New_York">Eastern</option>
              </select>
            </div>
          </div>
        </section>

        {/* Data Display */}
        <section className="border-b pb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Display</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Default Chart Type</label>
                <p className="text-xs text-gray-500">KPI visualizations default style</p>
              </div>
              <select 
                value={settings.defaultChartType}
                onChange={(e) => updateSetting('defaultChartType', e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
              >
                <option value="bar">Bar Chart</option>
                <option value="line">Line Chart</option>
                <option value="heatmap">Heat Map</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Color Scheme</label>
                <p className="text-xs text-gray-500">Chart color palette</p>
              </div>
              <select 
                value={settings.colorScheme}
                onChange={(e) => updateSetting('colorScheme', e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
              >
                <option value="default">Default (Fire Red/Medical Blue)</option>
                <option value="colorblind">Colorblind Friendly</option>
                <option value="grayscale">Grayscale</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Data Refresh</label>
                <p className="text-xs text-gray-500">Auto-refresh interval for live data</p>
              </div>
              <select 
                value={settings.refreshInterval}
                onChange={(e) => updateSetting('refreshInterval', parseInt(e.target.value))}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
              >
                <option value={15}>15 seconds</option>
                <option value={30}>30 seconds</option>
                <option value={60}>1 minute</option>
                <option value={300}>5 minutes</option>
                <option value={0}>Manual only</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Default Region</label>
                <p className="text-xs text-gray-500">85260 is the split between North/South stations</p>
              </div>
              <select 
                value={settings.defaultRegion}
                onChange={(e) => updateSetting('defaultRegion', e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Stations</option>
                <option value="south">South Scottsdale</option>
                <option value="north">North Scottsdale</option>
              </select>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="border-b pb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                <p className="text-xs text-gray-500">Receive alerts via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.emailNotifications}
                  onChange={(e) => updateSetting('emailNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Alert Types</label>
                <p className="text-xs text-gray-500">Which incident types trigger notifications</p>
              </div>
              <div className="flex gap-2">
                {['critical', 'warning', 'info'].map(type => (
                  <label key={type} className="inline-flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={settings.alertTypes.includes(type)}
                      onChange={(e) => {
                        const newTypes = e.target.checked
                          ? [...settings.alertTypes, type]
                          : settings.alertTypes.filter(t => t !== type);
                        updateSetting('alertTypes', newTypes);
                      }}
                      className="mr-1"
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Report Delivery</label>
                <p className="text-xs text-gray-500">Automated report email frequency</p>
              </div>
              <select 
                value={settings.reportDelivery}
                onChange={(e) => updateSetting('reportDelivery', e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
              >
                <option value="none">None</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
        </section>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-3">
        <button 
          onClick={saveSettings}
          disabled={!hasChanges || saveStatus === 'saving'}
          className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {saveStatus === 'saving' ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : saveStatus === 'saved' ? (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Saved!
            </>
          ) : (
            'Save Changes'
          )}
        </button>
        <button 
          onClick={resetToDefaults}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Reset to Defaults
        </button>
      </div>

      {saveStatus === 'error' && (
        <p className="mt-3 text-sm text-red-600">Failed to save settings. Please try again.</p>
      )}
    </div>
  );
};

export default Settings;
