import React, { useEffect, useMemo, useState } from 'react'

const chartOptions = [
  { label: 'Heatmap', value: 'heatmap' },
  { label: 'Postal Code', value: 'postal_code' },
  { label: 'Type Breakdown', value: 'type_breakdown' },
  { label: 'Unit Hour Utilization', value: 'unit_hour_utilization' },
  { label: 'Call Volume Trend', value: 'call_volume_trend' },
  { label: 'Mutual Aid', value: 'mutual_aid' },
]

const defaultSettings = {
  enabled: false,
  rotationIntervalSeconds: 30,
  selectedCharts: chartOptions.map((option) => option.value),
  showBasicKpis: true,
  autoStartPlayback: false,
}

const TVModeSettings = ({ onBack, setParentSettings }) => {
  const [settings, setSettings] = useState(defaultSettings)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')
  

  useEffect(() => {
    const stored = localStorage.getItem('tvModeSettings')
    if (!stored) return

    try {
      const parsed = JSON.parse(stored)
      setSettings({
        ...defaultSettings,
        ...parsed,
        selectedCharts: Array.isArray(parsed.selectedCharts)
          ? parsed.selectedCharts.filter((value) =>
              chartOptions.some((option) => option.value === value)
            )
          : defaultSettings.selectedCharts,
      })
    } catch (error) {
      console.error('Failed to load TV mode settings:', error)
    }
  }, [])

  const selectedChartLabels = useMemo(
    () =>
      chartOptions
        .filter((option) => settings.selectedCharts.includes(option.value))
        .map((option) => option.label),
    [settings.selectedCharts]
  )

  const updateParentSettings = () => {
    setParentSettings(settings);
  }

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
    setSaveError('')
  }

  const handleChartToggle = (chartValue) => {
    setSettings((prev) => {
      const selectedCharts = prev.selectedCharts.includes(chartValue)
        ? prev.selectedCharts.filter((value) => value !== chartValue)
        : [...prev.selectedCharts, chartValue]

      return {
        ...prev,
        selectedCharts,
      }
    })
    setSaved(false)
    setSaveError('')
  }

  const handleSave = () => {
    if (settings.enabled && settings.selectedCharts.length === 0) {
      setSaveError('Select at least one chart before enabling TV mode.')
      setSaved(false)
      return
    }

    if (settings.rotationIntervalSeconds < 10 || settings.rotationIntervalSeconds > 300) {
      setSaveError('Rotation interval must be between 10 and 300 seconds.')
      setSaved(false)
      return
    }

    localStorage.setItem('tvModeSettings', JSON.stringify(settings))
    setSaved(true)
    setSaveError('')
    window.setTimeout(() => setSaved(false), 3000)
    updateParentSettings()
  }

  const handleReset = () => {
    setSettings(defaultSettings)
    setSaved(false)
    setSaveError('')
  }

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto text-white space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">Admin Settings</p>
          <h1 className="text-2xl sm:text-3xl font-semibold">TV Mode Settings</h1>
          <p className="text-sm text-white/75 mt-1">
            Configure the chart rotation profile used for wall displays and passive monitoring screens.
          </p>
        </div>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition"
          >
            Back to Settings
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-6">
        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-lg shadow divide-y divide-white/10">
          <div className="p-4 sm:p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-medium">Playback</h2>
                <p className="text-sm text-white/75 mt-1">
                  Control whether TV mode is enabled and how quickly the display rotates between charts.
                </p>
              </div>
              <label className="inline-flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={settings.enabled}
                  onChange={(event) => handleSettingChange('enabled', event.target.checked)}
                  className="w-4 h-4"
                />
                Enabled
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-white">Rotation Interval (seconds)</label>
              <input
                type="number"
                min="10"
                max="300"
                step="5"
                value={settings.rotationIntervalSeconds}
                onChange={(event) =>
                  handleSettingChange('rotationIntervalSeconds', Number(event.target.value))
                }
                className="w-full px-3 py-2 border rounded-md bg-white text-gray-900"
              />
              <p className="text-xs text-white/70 mt-1">
                Recommended range: 15 to 60 seconds per chart.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm">
                <span>Include KPI summary cards</span>
                <input
                  type="checkbox"
                  checked={settings.showBasicKpis}
                  onChange={(event) => handleSettingChange('showBasicKpis', event.target.checked)}
                  className="w-4 h-4"
                />
              </label>
              <label className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm">
                <span>Start playback automatically</span>
                <input
                  type="checkbox"
                  checked={settings.autoStartPlayback}
                  onChange={(event) =>
                    handleSettingChange('autoStartPlayback', event.target.checked)
                  }
                  className="w-4 h-4"
                />
              </label>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-4">
            <div>
              <h2 className="text-lg font-medium">Chart Selection</h2>
              <p className="text-sm text-white/75 mt-1">
                Choose which dashboard visualizations are included in the TV mode rotation profile.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {chartOptions.map((option) => {
                const checked = settings.selectedCharts.includes(option.value)
                return (
                  <label
                    key={option.value}
                    className={`flex items-center justify-between rounded-lg border px-4 py-3 text-sm transition ${
                      checked
                        ? 'border-blue-300/50 bg-blue-500/20 text-white'
                        : 'border-white/10 bg-white/5 text-white/85 hover:bg-white/10'
                    }`}
                  >
                    <span>{option.label}</span>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleChartToggle(option.value)}
                      className="w-4 h-4"
                    />
                  </label>
                )
              })}
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-lg shadow p-4 sm:p-6 space-y-4">
          <div>
            <h2 className="text-lg font-medium">Profile Summary</h2>
            <p className="text-sm text-white/75 mt-1">
              Review the current TV mode configuration before saving.
            </p>
          </div>

          <div className="space-y-3 text-sm text-white/85">
            <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">Status</p>
              <p className="mt-1 font-medium">{settings.enabled ? 'Enabled' : 'Disabled'}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">Rotation Interval</p>
              <p className="mt-1 font-medium">{settings.rotationIntervalSeconds} seconds</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">Selected Charts</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedChartLabels.length > 0 ? (
                  selectedChartLabels.map((label) => (
                    <span
                      key={label}
                      className="rounded-full bg-blue-500/30 px-3 py-1 text-xs font-medium text-white"
                    >
                      {label}
                    </span>
                  ))
                ) : (
                  <span className="text-white/65">No charts selected</span>
                )}
              </div>
            </div>
          </div>

          {saveError && (
            <div className="rounded-lg border border-red-300/40 bg-red-500/20 px-4 py-3 text-sm text-red-100">
              {saveError}
            </div>
          )}

          {saved && (
            <div className="rounded-lg border border-green-300/40 bg-green-500/20 px-4 py-3 text-sm text-green-100">
              TV mode settings saved successfully.
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Save TV Mode Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TVModeSettings
