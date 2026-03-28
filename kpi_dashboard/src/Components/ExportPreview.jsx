import React from 'react'
import { useLocation } from 'react-router-dom'
import {
  getRegionLabel,
  getSelectedChartOptions,
  parseExportPreviewSearch,
} from './Dashboard/exportConfig'

const ExportPreview = () => {
  const { search } = useLocation()
  const settings = parseExportPreviewSearch(search)
  const selectedChartOptions = getSelectedChartOptions(settings.selectedCharts)

  return (
    <div className="p-4 text-sm text-black">
      <h1>Export Preview Placeholder</h1>
      <p>This page displays the selected export settings are being passed into a new tab.</p>
      <p>Region: {getRegionLabel(settings.region)}</p>
      <p>Start Date: {settings.startDate || 'Not provided'}</p>
      <p>End Date: {settings.endDate || 'Not provided'}</p>
      <p>Selected Charts:</p>
      {selectedChartOptions.length > 0 ? (
        <ul className="list-disc pl-5">
          {selectedChartOptions.map((option) => (
            <li key={option.value}>{option.label}</li>
          ))}
        </ul>
      ) : (
        <p>None</p>
      )}
      <p>This preview does not render any charts yet.</p>
    </div>
  )
}

export default ExportPreview
