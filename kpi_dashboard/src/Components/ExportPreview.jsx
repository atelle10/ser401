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
  fetchCallVolume,
  fetchExportSummary,
  fetchKPIData,
  fetchIncidentHeatmap,
  fetchKPISummary,
  fetchMutualAid,
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
import { buildExportSummaryPayload } from './exportSummaryPayload'
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
const SUMMARY_RESOLVED_STATUSES = new Set(['ready', 'unavailable', 'error'])

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

const AI_SUMMARY_CAUTION =
  'AI-generated content may include interpretation and should be reviewed alongside the report data.'

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
  const [loadedPreviewKey, setLoadedPreviewKey] = useState('')
  const [error, setError] = useState('')
  const [hasTriggeredPrint, setHasTriggeredPrint] = useState(false)
  const [generatedAt] = useState(() => new Date())
  const [summaryStatus, setSummaryStatus] = useState('idle')
  const [summaryParagraph, setSummaryParagraph] = useState('')
  const [summaryHighlights, setSummaryHighlights] = useState([])
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
  const isSummaryReadyForPrint = useMemo(
    () => SUMMARY_RESOLVED_STATUSES.has(summaryStatus),
    [summaryStatus]
  )
  const timePeriodHours = useMemo(() => {
    if (!dateRange.startDate || !dateRange.endDate) return 24

    return (new Date(dateRange.endDate) - new Date(dateRange.startDate)) / (1000 * 60 * 60)
  }, [dateRange.endDate, dateRange.startDate])
  const previewLoadKey = useMemo(
    () => JSON.stringify({
      region: settings.region,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      selectedCharts: settings.selectedCharts,
    }),
    [dateRange.endDate, dateRange.startDate, settings.region, settings.selectedCharts]
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
      setLoadedPreviewKey('')
      setError('Start and end date are required to load chart previews.')
      return
    }

    if (selectedChartOptions.length === 0) {
      setPreviewData(EMPTY_PREVIEW_DATA)
      setIsLoading(false)
      setLoadedPreviewKey(previewLoadKey)
      setError('')
      return
    }

    if (Object.values(needsSharedPreviewData).every((value) => !value)) {
      setPreviewData(EMPTY_PREVIEW_DATA)
      setIsLoading(false)
      setLoadedPreviewKey(previewLoadKey)
      setError('')
      return
    }

    let cancelled = false

    const loadPreviewData = async () => {
      setIsLoading(true)
      setLoadedPreviewKey('')
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
      setLoadedPreviewKey(previewLoadKey)
    }

    loadPreviewData()

    return () => {
      cancelled = true
    }
  }, [
    dateRange.endDate,
    dateRange.startDate,
    needsSharedPreviewData,
    previewLoadKey,
    selectedChartOptions.length,
    settings.region,
  ])

  useEffect(() => {
    setHasTriggeredPrint(false)
    setAsyncChartStatus(buildAsyncChartStatus(settings.selectedCharts))
    setSummaryStatus('idle')
    setSummaryParagraph('')
    setSummaryHighlights([])
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
    if (!dateRange.startDate || !dateRange.endDate || selectedChartOptions.length === 0) {
      setSummaryStatus('idle')
      setSummaryParagraph('')
      setSummaryHighlights([])
      return
    }

    if (loadedPreviewKey !== previewLoadKey || isLoading) {
      return
    }

    let cancelled = false

    const loadSummary = async () => {
      setSummaryStatus('loading')
      setSummaryParagraph('')
      setSummaryHighlights([])

      const [overviewResult, callVolumeResult, mutualAidResult] = await Promise.all([
        fetchKPISummary({
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          region: settings.region,
        }),
        selectedChartSet.has('call_volume_trend')
          ? fetchCallVolume({
              startDate: dateRange.startDate,
              endDate: dateRange.endDate,
              region: settings.region,
            })
          : Promise.resolve({ success: true, data: { trend_data: [] }, error: null }),
        selectedChartSet.has('mutual_aid')
          ? fetchMutualAid({
              startDate: dateRange.startDate,
              endDate: dateRange.endDate,
              region: settings.region,
            })
          : Promise.resolve({
              success: true,
              data: {
                scottsdale_units_outside: null,
                other_units_in_scottsdale: null,
              },
              error: null,
            }),
      ])

      if (cancelled) return

      const sourceError = [overviewResult, callVolumeResult, mutualAidResult].find(
        (result) => !result.success
      )?.error

      if (sourceError) {
        setSummaryStatus('error')
        return
      }

      const payload = buildExportSummaryPayload({
        settings,
        dateRange,
        overviewData: overviewResult.data,
        previewData,
        callVolumeData: callVolumeResult.data,
        mutualAidData: mutualAidResult.data,
        timePeriodHours,
      })

      const summaryResult = await fetchExportSummary(payload)
      if (cancelled) return

      if (!summaryResult.success) {
        setSummaryStatus('error')
        return
      }

      const nextStatus = SUMMARY_RESOLVED_STATUSES.has(summaryResult.data?.status)
        ? summaryResult.data.status
        : 'error'

      setSummaryStatus(nextStatus)
      if (nextStatus === 'ready') {
        setSummaryParagraph(
          summaryResult.data?.summary_paragraph || summaryResult.data?.summary || ''
        )
        setSummaryHighlights(
          Array.isArray(summaryResult.data?.summary_highlights)
            ? summaryResult.data.summary_highlights
                .filter((item) => typeof item === 'string' && item.trim())
                .slice(0, 3)
            : []
        )
        return
      }

      setSummaryParagraph('')
      setSummaryHighlights([])
    }

    loadSummary()

    return () => {
      cancelled = true
    }
  }, [
    dateRange.endDate,
    dateRange.startDate,
    isLoading,
    loadedPreviewKey,
    previewData,
    previewLoadKey,
    selectedChartOptions.length,
    selectedChartSet,
    settings,
    timePeriodHours,
  ])

  useEffect(() => {
    if (
      !autoPrintEnabled ||
      hasTriggeredPrint ||
      isLoading ||
      !dateRange.startDate ||
      !dateRange.endDate ||
      selectedChartOptions.length === 0 ||
      !areAsyncChartsReady ||
      !isSummaryReadyForPrint
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
    isSummaryReadyForPrint,
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

          {(summaryStatus === 'loading' || summaryStatus === 'ready' || isSummaryReadyForPrint) && (
            <div className="export-preview-summary">
              <div className="export-preview-summary-header">
                <span className="export-preview-summary-badge">AI-generated</span>
                <h2 className="export-preview-summary-title">Report Summary</h2>
              </div>
              {summaryStatus === 'ready' && (summaryParagraph || summaryHighlights.length > 0) ? (
                <div className="export-preview-summary-content">
                  {summaryParagraph && (
                    <p className="export-preview-summary-text">{summaryParagraph}</p>
                  )}
                  {summaryHighlights.length > 0 && (
                    <div className="export-preview-summary-takeaways">
                      <h3 className="export-preview-summary-subtitle">Key Takeaways</h3>
                      <ul className="export-preview-summary-highlights">
                        {summaryHighlights.map((highlight) => (
                          <li key={highlight}>{highlight}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : summaryStatus === 'loading' ? (
                <p className="export-preview-summary-text">Generating AI summary…</p>
              ) : (
                <p className="export-preview-summary-fallback">
                  AI summary unavailable for this export. Review the report data directly.
                </p>
              )}
              <p className="export-preview-summary-caution">{AI_SUMMARY_CAUTION}</p>
            </div>
          )}

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
