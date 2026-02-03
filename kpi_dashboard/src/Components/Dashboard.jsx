import React, { useCallback, useEffect, useMemo, useState } from 'react'
import HeatMapDayHour from './Dashboard/KPIs/HeatMapDayHour'
import UnitHourUtilization from './Dashboard/KPIs/UnitHourUtilization'
import CallVolumeLinearChart from './Dashboard/KPIs/CallVolumeLinearChart'
import Chart from './Dashboard/Chart'
import LoadingSpinner from './Dashboard/KPIs/LoadingSpinner'
import ErrorMessage from './Dashboard/KPIs/ErrorMessage'
import { fetchKPIData } from '../services/incidentDataService'

const Dashboard = () => {
  const [region, setRegion] = useState('south')
  const [timeWindow, setTimeWindow] = useState(7)
  const [incidentData, setIncidentData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false)

  const dateRange = useMemo(() => {
    const end = new Date()
    const start = new Date(end.getTime() - timeWindow * 24 * 60 * 60 * 1000)
    return { startDate: start.toISOString(), endDate: end.toISOString() }
  }, [timeWindow])

  const loadIncidentData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    const result = await fetchKPIData({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      region,
    })

    if (!result.success) {
      setError(result.error || 'Failed to load incident data')
      setIsLoading(false)
      return
    }

    setIncidentData(result.data || [])
    setHasLoadedOnce(true)
    setIsLoading(false)
  }, [dateRange.endDate, dateRange.startDate, region])

  useEffect(() => {
    loadIncidentData()
  }, [loadIncidentData])

  return (
    <div className="p-2 sm:p-4 space-y-4 sm:space-y-6">
      {/* Filters - Stack on mobile, side-by-side on larger screens */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-3 sm:p-4 rounded-lg">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          <label className="text-xs sm:text-sm font-medium">Region:</label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="px-3 py-2 text-sm border rounded w-full sm:w-auto text-blue-800/80"
          >
            <option value="south">South Scottsdale</option>
            <option value="north">North Scottsdale</option>
          </select>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          <label className="text-xs sm:text-sm font-medium">Time Window:</label>
          <select
            value={timeWindow}
            onChange={(e) => setTimeWindow(Number(e.target.value))}
            className="px-3 py-2 text-sm border rounded w-full sm:w-auto text-blue-600"
          >
            <option value={7}>Last 7 Days</option>
            <option value={14}>Last 14 Days</option>
            <option value={30}>Last 30 Days</option>
          </select>
        </div>
      </div>

      {error && (
        <ErrorMessage message={error} onRetry={loadIncidentData} color="blue" />
      )}

      {isLoading && !hasLoadedOnce && (
        <div className="py-6">
          <LoadingSpinner color="blue" />
        </div>
      )}

      {/* KPI Components Grid - Single column on mobile, 2 columns on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 rounded-lg">
          <h3 className="font-semibold mb-3">Heat Map: Incidents by Day × Hour</h3>
          <HeatMapDayHour data={incidentData} region={region} weeks={1} />
        </div>

        <div className="h-fit bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 rounded-lg">
          <h3 className="font-semibold mb-3">Unit Hour Utilization (UHU)</h3>
          <UnitHourUtilization data={incidentData} />
        </div>

        <div className="col-span-1 lg:col-span-2 bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 rounded-lg">
          <h3 className="font-semibold mb-3">Call Volume Trend</h3>
          <CallVolumeLinearChart 
            data={incidentData} 
            region={region}
            granularity="daily"
          />
        </div>

        {/* Placeholder for additional charts or KPIs - Currently hidden from view */}
        <div className="hidden col-span-1 lg:col-span-2 bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 rounded-lg">
          <Chart />
        </div>
      </div>
    </div>
  )
}

export default Dashboard