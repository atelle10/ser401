import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import HeatMapDayHour from './Dashboard/KPIs/HeatMapDayHour'
import UnitHourUtilization from './Dashboard/KPIs/UnitHourUtilization'
import UnitHourUtilizationByOrigin from './Dashboard/KPIs/UnitHourUtilizationByOrigin'
import MutualAidChart from './Dashboard/KPIs/MutualAidChart'
import CallVolumeLinearChart from './Dashboard/KPIs/CallVolumeLinearChart'
import IncidentsByPostalCode from './Dashboard/KPIs/IncidentsByPostalCode'
import IncidentTypeBreakdown from './Dashboard/KPIs/IncidentTypeBreakdown'
import ResponseTimeBreakdown from './Dashboard/KPIs/ResponseTimeBreakdown'
import {
  fetchKPIData,
  fetchIncidentHeatmap,
  fetchPostalBreakdown,
  fetchResponseTimes,
  fetchTypeBreakdown,
  fetchUnitOrigin,
} from '../services/incidentDataService'
import {
  buildIsoRangeFromDateInputs,
  getRegionLabel,
  getSelectedChartOptions,
  parseExportPreviewSearch,
} from './Dashboard/exportConfig'
import { authClient } from '../utils/authClient'
import './ExportPreview.css'

const EMPTY_PREVIEW_DATA = {
  incidentData: [],
  heatmapData: [],
  postalData: [],
  typeBreakdownData: null,
  unitOriginData: null,
  responseTimeData: null,
}

const PRINT_READY_CHARTS = new Set([
  'call_volume_trend',
  'mutual_aid',
  'response_time_breakdown',
])

const buildAsyncChartStatus = (selectedCharts = []) =>
  selectedCharts.reduce((status, chartKey) => {
    if (PRINT_READY_CHARTS.has(chartKey)) {
      status[chartKey] = false
    }

    return status
  }, {})

const formatDateDisplay = (value) => {
  if (!value) return 'Not provided'

  const parsed = new Date(`${value}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return value

  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const ExportPreview = () => {
  const { search } = useLocation()
  const { data: session } = authClient.useSession()
  const settings = useMemo(() => parseExportPreviewSearch(search), [search])
  const autoPrintEnabled = useMemo(
    () => new URLSearchParams(search).get('autoprint') === '1',
    [search]
  )
  const selectedChartOptions = useMemo(
    () => getSelectedChartOptions(settings.selectedCharts),
    [settings.selectedCharts]
  )
  const dateRange = useMemo(
    () => buildIsoRangeFromDateInputs({ start: settings.startDate, end: settings.endDate }),
    [settings.endDate, settings.startDate]
  )
  const [previewData, setPreviewData] = useState(EMPTY_PREVIEW_DATA)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasTriggeredPrint, setHasTriggeredPrint] = useState(false)
  const [generatedAt] = useState(() => new Date())
  const [asyncChartStatus, setAsyncChartStatus] = useState(() =>
    buildAsyncChartStatus(settings.selectedCharts)
  )
  const selectedChartSet = useMemo(() => new Set(settings.selectedCharts), [settings.selectedCharts])
  const regionLabel = useMemo(() => getRegionLabel(settings.region), [settings.region])
  const generatedBy = useMemo(
    () => session?.user?.name || session?.user?.username || session?.user?.email || 'Unknown user',
    [session?.user?.email, session?.user?.name, session?.user?.username]
  )
  const generatedAtLabel = useMemo(
    () =>
      generatedAt.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }),
    [generatedAt]
  )
  const areAsyncChartsReady = useMemo(
    () => Object.values(asyncChartStatus).every(Boolean),
    [asyncChartStatus]
  )
  const needsSharedPreviewData = useMemo(() => ({
    incidentData:
      selectedChartSet.has('heatmap') || selectedChartSet.has('unit_hour_utilization'),
    heatmapData: selectedChartSet.has('heatmap'),
    postalData: selectedChartSet.has('postal_code'),
    typeBreakdownData: selectedChartSet.has('type_breakdown'),
    unitOriginData: selectedChartSet.has('unit_hour_utilization'),
    responseTimeData: selectedChartSet.has('response_time_breakdown'),
  }), [selectedChartSet])

  useEffect(() => {
    if (!dateRange.startDate || !dateRange.endDate) {
      setPreviewData(EMPTY_PREVIEW_DATA)
      setIsLoading(false)
      setError('Start and end date are required to load chart previews.')
      return
    }

    if (selectedChartOptions.length === 0) {
      setPreviewData(EMPTY_PREVIEW_DATA)
      setIsLoading(false)
      setError('')
      return
    }

    if (Object.values(needsSharedPreviewData).every((value) => !value)) {
      setPreviewData(EMPTY_PREVIEW_DATA)
      setIsLoading(false)
      setError('')
      return
    }

    let cancelled = false

    const loadPreviewData = async () => {
      setIsLoading(true)
      setError('')

      const [incidentResult, heatmapResult, postalResult, typeBreakdownResult, unitOriginResult, responseTimesResult] = await Promise.all([
        needsSharedPreviewData.incidentData
          ? fetchKPIData({
              startDate: dateRange.startDate,
              endDate: dateRange.endDate,
              region: settings.region,
            })
          : Promise.resolve({ success: true, data: [], error: null }),
        needsSharedPreviewData.heatmapData
          ? fetchIncidentHeatmap({
              startDate: dateRange.startDate,
              endDate: dateRange.endDate,
              region: settings.region,
            })
          : Promise.resolve({ success: true, data: { heatmap_data: [] }, error: null }),
        needsSharedPreviewData.postalData
          ? fetchPostalBreakdown({
              startDate: dateRange.startDate,
              endDate: dateRange.endDate,
              region: settings.region,
            })
          : Promise.resolve({ success: true, data: { postal_data: [] }, error: null }),
        needsSharedPreviewData.typeBreakdownData
          ? fetchTypeBreakdown({
              startDate: dateRange.startDate,
              endDate: dateRange.endDate,
              region: settings.region,
            })
          : Promise.resolve({ success: true, data: null, error: null }),
        needsSharedPreviewData.unitOriginData
          ? fetchUnitOrigin({
              startDate: dateRange.startDate,
              endDate: dateRange.endDate,
              region: settings.region,
            })
          : Promise.resolve({ success: true, data: null, error: null }),
        needsSharedPreviewData.responseTimeData
          ? fetchResponseTimes({
              startDate: dateRange.startDate,
              endDate: dateRange.endDate,
              region: settings.region,
            })
          : Promise.resolve({ success: true, data: null, error: null }),
      ])

      if (cancelled) return

      setPreviewData({
        incidentData: incidentResult.success ? incidentResult.data || [] : [],
        heatmapData: heatmapResult.success ? heatmapResult.data?.heatmap_data || [] : [],
        postalData: postalResult.success ? postalResult.data?.postal_data || [] : [],
        typeBreakdownData: typeBreakdownResult.success ? typeBreakdownResult.data || null : null,
        unitOriginData: unitOriginResult.success ? unitOriginResult.data || null : null,
        responseTimeData: responseTimesResult.success ? responseTimesResult.data || null : null,
      })

      const nextError = [
        incidentResult,
        heatmapResult,
        postalResult,
        typeBreakdownResult,
        unitOriginResult,
        responseTimesResult,
      ]
        .find((result) => !result.success)
        ?.error

      setError(nextError || '')
      setIsLoading(false)
    }

    loadPreviewData()

    return () => {
      cancelled = true
    }
  }, [
    dateRange.endDate,
    dateRange.startDate,
    needsSharedPreviewData,
    selectedChartOptions.length,
    settings.region,
  ])

  useEffect(() => {
    setHasTriggeredPrint(false)
    setAsyncChartStatus(buildAsyncChartStatus(settings.selectedCharts))
  }, [search, settings.selectedCharts])

  useEffect(() => {
    const dateLabel = [settings.startDate, settings.endDate]
      .filter(Boolean)
      .join(' to ')

    document.title = dateLabel
      ? `KPI Analytics Report - ${regionLabel} - ${dateLabel}`
      : 'KPI Analytics Report'
  }, [regionLabel, settings.endDate, settings.startDate])

  useEffect(() => {
    if (
      !autoPrintEnabled ||
      hasTriggeredPrint ||
      isLoading ||
      !dateRange.startDate ||
      !dateRange.endDate ||
      selectedChartOptions.length === 0 ||
      !areAsyncChartsReady
    ) {
      return undefined
    }

    let firstFrameId = 0
    let secondFrameId = 0

    firstFrameId = window.requestAnimationFrame(() => {
      secondFrameId = window.requestAnimationFrame(() => {
        window.print()
        setHasTriggeredPrint(true)
      })
    })

    return () => {
      window.cancelAnimationFrame(firstFrameId)
      window.cancelAnimationFrame(secondFrameId)
    }
  }, [
    autoPrintEnabled,
    areAsyncChartsReady,
    dateRange.endDate,
    dateRange.startDate,
    hasTriggeredPrint,
    isLoading,
    selectedChartOptions.length,
  ])

  const handleAsyncChartReadyChange = useCallback((chartKey, isReady) => {
    setAsyncChartStatus((current) => {
      if (!(chartKey in current) || current[chartKey] === isReady) {
        return current
      }

      return {
        ...current,
        [chartKey]: isReady,
      }
    })
  }, [])
  const handleCallVolumeReadyChange = useCallback(
    (isReady) => handleAsyncChartReadyChange('call_volume_trend', isReady),
    [handleAsyncChartReadyChange]
  )
  const handleMutualAidReadyChange = useCallback(
    (isReady) => handleAsyncChartReadyChange('mutual_aid', isReady),
    [handleAsyncChartReadyChange]
  )
  const handleResponseTimeReadyChange = useCallback(
    (isReady) => handleAsyncChartReadyChange('response_time_breakdown', isReady),
    [handleAsyncChartReadyChange]
  )

  const timePeriodHours = useMemo(() => {
    if (!dateRange.startDate || !dateRange.endDate) return 24

    return (new Date(dateRange.endDate) - new Date(dateRange.startDate)) / (1000 * 60 * 60)
  }, [dateRange.endDate, dateRange.startDate])

  const chartSections = useMemo(() => ({
    heatmap: {
      title: 'Heat Map: Incidents by Day x Hour',
      content: (
        <HeatMapDayHour
          data={previewData.incidentData}
          heatmapData={previewData.heatmapData}
          region={settings.region}
          weeks={1}
        />
      ),
    },
    postal_code: {
      title: 'Incidents by Postal Code',
      content: <IncidentsByPostalCode data={previewData.postalData} />,
    },
    type_breakdown: {
      title: 'Incident Type Breakdown',
      content: <IncidentTypeBreakdown data={previewData.typeBreakdownData} />,
    },
    unit_hour_utilization: {
      title: 'Unit Hour Utilization',
      content: (
        <div className="space-y-4">
          <UnitHourUtilization
            data={previewData.incidentData}
            timePeriodHours={timePeriodHours}
            printView
          />
          <UnitHourUtilizationByOrigin
            scottsdaleUhu={previewData.unitOriginData?.scottsdale_uhu}
            nonScottsdaleUhu={previewData.unitOriginData?.non_scottsdale_uhu}
          />
        </div>
      ),
    },
    call_volume_trend: {
      title: 'Call Volume Trend',
      content: (
        <CallVolumeLinearChart
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          region={settings.region}
          onReadyChange={handleCallVolumeReadyChange}
        />
      ),
    },
    mutual_aid: {
      title: 'Mutual Aid',
      content: (
        <MutualAidChart
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          region={settings.region}
          onReadyChange={handleMutualAidReadyChange}
        />
      ),
    },
    response_time_breakdown: {
      title: 'Response Time Breakdown',
      content: (
        <ResponseTimeBreakdown
          overall={previewData.responseTimeData?.overall}
          perUnit={previewData.responseTimeData?.per_unit}
          printView
          onReadyChange={handleResponseTimeReadyChange}
        />
      ),
    },
  }), [
    dateRange.endDate,
    dateRange.startDate,
    previewData.heatmapData,
    previewData.incidentData,
    previewData.postalData,
    previewData.responseTimeData,
    previewData.typeBreakdownData,
    previewData.unitOriginData,
    handleCallVolumeReadyChange,
    handleMutualAidReadyChange,
    handleResponseTimeReadyChange,
    settings.region,
    timePeriodHours,
  ])

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="export-preview-page">
      <div className="export-preview-toolbar">
        <div className="export-preview-toolbar-copy">
          <strong>Print preview</strong>
          <p>
            This page is formatted for the browser print dialog. Use it to print or save as PDF.
          </p>
        </div>
        <div className="export-preview-toolbar-actions">
          <button
            type="button"
            onClick={handlePrint}
            className="export-preview-toolbar-button"
          >
            Print / Save as PDF
          </button>
        </div>
      </div>

      <div className="export-preview-document export-preview-root">
        <header className="export-preview-header">
          <p className="export-preview-eyebrow">FAMAR KPI analytics</p>
          <h1 className="export-preview-title">KPI Data Analytics Report</h1>

          <div className="export-preview-meta">
            <div className="export-preview-meta-item">
              <span className="export-preview-meta-label">Region</span>
              <span className="export-preview-meta-value">{regionLabel}</span>
            </div>
            <div className="export-preview-meta-item">
              <span className="export-preview-meta-label">Start date</span>
              <span className="export-preview-meta-value">
                {formatDateDisplay(settings.startDate)}
              </span>
            </div>
            <div className="export-preview-meta-item">
              <span className="export-preview-meta-label">End date</span>
              <span className="export-preview-meta-value">
                {formatDateDisplay(settings.endDate)}
              </span>
            </div>
            <div className="export-preview-meta-item">
              <span className="export-preview-meta-label">Charts included</span>
              <span className="export-preview-meta-value">{selectedChartOptions.length}</span>
            </div>
          </div>
        </header>

        {error && (
          <div className="export-preview-feedback">
            Some preview data could not be loaded: {error}
          </div>
        )}

        {isLoading && (
          <div className="export-preview-state">
            Preparing charts for print…
          </div>
        )}

        {!isLoading && selectedChartOptions.length === 0 && (
          <div className="export-preview-state">No charts selected.</div>
        )}

        {!isLoading && selectedChartOptions.length > 0 && (
          <div>
            {selectedChartOptions.map((option) => (
              <section key={option.value} className="export-preview-section">
                <h2 className="export-preview-section-title">
                  {chartSections[option.value].title}
                </h2>
                {chartSections[option.value].content}
              </section>
            ))}
          </div>
        )}

        <footer className="export-preview-footer">
          <span>Generated {generatedAtLabel}</span>
          <span>Prepared by {generatedBy}</span>
        </footer>
      </div>
    </div>
  )
}

export default ExportPreview
