import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { chartOptions, regionOptions } from './exportConfig'

const ExportPdfModal = ({
  isOpen,
  onClose,
  settings,
  onFieldChange,
  onToggleChart,
  onPreview,
}) => {
  useEffect(() => {
    if (!isOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen || !settings) return null

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/35 p-4 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-pdf-title"
    >
      <div
        className="w-full max-w-3xl rounded-2xl border border-blue-700 bg-blue-900 p-5 text-white shadow-2xl shadow-blue-950/50 sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="export-pdf-title" className="text-xl font-semibold text-white">
              Export PDF
            </h2>
            <p className="mt-1 text-sm text-blue-50/80">
              Review the export settings. These values are prefilled from the current dashboard.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-blue-700 bg-blue-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-800"
          >
            Close
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-1">
            <label className="text-sm font-medium text-blue-50">Region</label>
            <select
              value={settings.region}
              onChange={(event) => onFieldChange('region', event.target.value)}
              className="w-full rounded-lg border border-blue-700 bg-blue-950 px-3 py-2 text-sm text-white"
            >
              {regionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-blue-50">Start Date</label>
            <input
              type="date"
              value={settings.startDate}
              onChange={(event) => onFieldChange('startDate', event.target.value)}
              className="w-full rounded-lg border border-blue-700 bg-blue-950 px-3 py-2 text-sm text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-blue-50">End Date</label>
            <input
              type="date"
              value={settings.endDate}
              onChange={(event) => onFieldChange('endDate', event.target.value)}
              className="w-full rounded-lg border border-blue-700 bg-blue-950 px-3 py-2 text-sm text-white"
            />
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between gap-3">
            <label className="text-sm font-medium text-blue-50">Charts Included</label>
            <span className="text-xs text-blue-50/70">
              {settings.selectedCharts.length} selected
            </span>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {chartOptions.map((option) => {
              const isSelected = settings.selectedCharts.includes(option.value)

              return (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${
                    isSelected
                      ? 'border-blue-400 bg-blue-800 text-white'
                      : 'border-blue-800 bg-blue-950 text-blue-50/85 hover:bg-blue-900'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleChart(option.value)}
                    className="h-4 w-4 rounded border-blue-400 bg-blue-950 text-blue-200"
                  />
                  <span>{option.label}</span>
                </label>
              )
            })}
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-blue-800 bg-blue-950 px-4 py-3 text-sm text-blue-50/80">
          Preview generation is not wired yet. This modal currently captures the export settings only.
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-blue-700 bg-blue-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onPreview}
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-md transition-colors hover:bg-blue-50"
          >
            Preview PDF
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

export default ExportPdfModal
