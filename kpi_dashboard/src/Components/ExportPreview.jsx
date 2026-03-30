import React, { useEffect, useMemo, useState } from 'react'
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

const EMPTY_PREVIEW_DATA = {
  incidentData: [],
  heatmapData: [],
  postalData: [],
  typeBreakdownData: null,
  unitOriginData: null,
  responseTimeData: null,
}

const ExportPreview = () => {
  const { search } = useLocation()
  const settings = useMemo(() => parseExportPreviewSearch(search), [search])
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
  const selectedChartSet = useMemo(() => new Set(settings.selectedCharts), [settings.selectedCharts])
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
        />
      ),
    },
    response_time_breakdown: {
      title: 'Response Time Breakdown',
      content: (
        <ResponseTimeBreakdown
          overall={previewData.responseTimeData?.overall}
          perUnit={previewData.responseTimeData?.per_unit}
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
    settings.region,
    timePeriodHours,
  ])

  return (
    <div className="space-y-6 p-4 text-sm text-black">
      <div>
        <h1>Export Preview</h1>
        <p>Region: {getRegionLabel(settings.region)}</p>
        <p>Start Date: {settings.startDate || 'Not provided'}</p>
        <p>End Date: {settings.endDate || 'Not provided'}</p>
      </div>

      {error && (
        <p className="text-red-600">
          Some preview data could not be loaded: {error}
        </p>
      )}

      {isLoading && <p>Loading chart preview...</p>}

      {!isLoading && selectedChartOptions.length === 0 && (
        <p>No charts selected.</p>
      )}

      {!isLoading && selectedChartOptions.length > 0 && (
        <div className="space-y-6">
          {selectedChartOptions.map((option) => (
            <section key={option.value} className="space-y-2">
              <h2 className="text-base font-semibold">{chartSections[option.value].title}</h2>
              {chartSections[option.value].content}
            </section>
          ))}
        </div>
      )}
    </div>
  )
}

export default ExportPreview
