import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import HeatMapDayHour from './Dashboard/KPIs/HeatMapDayHour'
import UnitHourUtilization from './Dashboard/KPIs/UnitHourUtilization'
import CallVolumeLinearChart from './Dashboard/KPIs/CallVolumeLinearChart'
import IncidentsByPostalCode from './Dashboard/KPIs/IncidentsByPostalCode'
import IncidentTypeBreakdown from './Dashboard/KPIs/IncidentTypeBreakdown'
import Chart from './Dashboard/Chart'
import KPI_1 from './Dashboard/KPIs/KPI_1'
import LoadingSpinner from './Dashboard/KPIs/LoadingSpinner'
import ErrorMessage from './Dashboard/KPIs/ErrorMessage'
import { fetchKPIData, fetchKPISummary, fetchIncidentHeatmap, fetchPostalBreakdown, fetchTypeBreakdown } from '../services/incidentDataService'
import { createSwapy } from 'swapy'
import './assets/style.css'

const formatDateInputValue = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const buildIsoRangeFromDateInputs = ({ start, end }) => {
  if (!start || !end) return { startDate: null, endDate: null }

  const startDate = new Date(`${start}T00:00:00.000Z`).toISOString()
  const endDate = new Date(`${end}T23:59:59.999Z`).toISOString()
  return { startDate, endDate }
}


const Dashboard = () => {
  function DraggableHeatMap(){
    <div className="bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 rounded-lg">
      <h3 className="font-semibold mb-3">Heat Map: Incidents by Day × Hour</h3>
      <HeatMapDayHour data={incidentData} heatmapData={heatmapData} region={region} weeks={1} />
    </div>
  }
  function DraggableUHU(){
    <div className=" bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 rounded-lg">
      <h3 className="font-semibold mb-3">Unit Hour Utilization (UHU)</h3>
      <UnitHourUtilization data={incidentData} />
    </div>
  }

  function DraggableCVLC(){
    <div className="bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 rounded-lg">
      <h3 className="font-semibold mb-3">Call Volume Trend</h3>
      <CallVolumeLinearChart
        startDate={dateRange.startDate}
        endDate={dateRange.endDate}
        region={region}
      />
    </div>
  }

  function DraggableBreakDown(){
    <div className="bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 rounded-lg">
      <h3 className="font-semibold mb-3">Incident Type Breakdown</h3>
      <IncidentTypeBreakdown data={typeBreakdownData} />
    </div>
  }

  function DraggablePostal(){
    <div className="bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 rounded-lg">
      <h3 className="font-semibold mb-3">Incidents by Postal Code</h3>
      <IncidentsByPostalCode data={postalData} />
    </div>
  }

  const [region, setRegion] = useState('south')
  const [timeWindow, setTimeWindow] = useState(7)
  const [isCustomRange, setIsCustomRange] = useState(false)
  const [dateInputs, setDateInputs] = useState(() => {
    const end = new Date()
    const start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000)
    return { start: formatDateInputValue(start), end: formatDateInputValue(end) }
  })
  const [incidentData, setIncidentData] = useState([])
  const [kpiSummary, setKpiSummary] = useState(null)
  const [heatmapData, setHeatmapData] = useState(null)
  const [postalData, setPostalData] = useState(null)
  const [typeBreakdownData, setTypeBreakdownData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false)

  const dateRange = useMemo(() => {
    if (isCustomRange) {
      return buildIsoRangeFromDateInputs(dateInputs)
    }

    const end = new Date()
    const start = new Date(end.getTime() - timeWindow * 24 * 60 * 60 * 1000)
    return { startDate: start.toISOString(), endDate: end.toISOString() }
  }, [dateInputs, isCustomRange, timeWindow])

  const swapyRef = useRef(null)
  const containerRef = useRef(null)

   useEffect(() => {
        if (containerRef.current) {
          swapyRef.current = createSwapy(containerRef.current, {
            animation: 'spring',
            // swapMode: 'drop',
            // autoScrollOnDrag: true,
            // enabled: true,
            // dragAxis: 'x',
          })
    
          // swapyRef.current.enable(false)
          // swapyRef.current.destroy()
          // console.log(swapyRef.current.slotItemMap())
    
          swapyRef.current.onBeforeSwap((event) => {
            console.log('beforeSwap', event)
            // This is for dynamically enabling and disabling swapping.
            // Return true to allow swapping, and return false to prevent swapping.
            return true
          })
    
          swapyRef.current.onSwapStart((event) => {
            console.log('start', event);
          })
          swapyRef.current.onSwap((event) => {
            console.log('swap', event);
          })
          swapyRef.current.onSwapEnd((event) => {
            console.log('end', event);
          })
        }
        return () => {
          swapyRef.current?.destroy()
        }
      }, [])

  useEffect(() => {
    if (isCustomRange) return

    const end = new Date()
    const start = new Date(end.getTime() - timeWindow * 24 * 60 * 60 * 1000)
    setDateInputs({ start: formatDateInputValue(start), end: formatDateInputValue(end) })
  }, [isCustomRange, timeWindow])

  const loadIncidentData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    if (!dateRange.startDate || !dateRange.endDate) {
      setError('Please select a start and end date')
      setIsLoading(false)
      return
    }

    if (new Date(dateRange.startDate) > new Date(dateRange.endDate)) {
      setError('Start date must be on or before end date')
      setIsLoading(false)
      return
    }

    const [incidentResult, summaryResult, heatmapResult, postalResult, typeBreakdownResult] = await Promise.all([
      fetchKPIData({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        region,
      }),
      fetchKPISummary({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        region,
      }),
      fetchIncidentHeatmap({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        region,
      }),
      fetchPostalBreakdown({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        region,
      }),
      fetchTypeBreakdown({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        region,
      }),
    ])

    if (!incidentResult.success) {
      setError(incidentResult.error || 'Failed to load incident data')
    } else {
      setIncidentData(incidentResult.data || [])
      setHasLoadedOnce(true)
    }

    if (!summaryResult.success) {
      setError((prev) => prev || summaryResult.error || 'Failed to load KPI summary')
    } else {
      setKpiSummary(summaryResult.data || null)
    }

    if (!heatmapResult.success) {
      setError((prev) => prev || heatmapResult.error || 'Failed to load heatmap data')
    } else {
      setHeatmapData(heatmapResult.data?.heatmap_data || [])
    }

    if (!postalResult.success) {
      setError((prev) => prev || postalResult.error || 'Failed to load postal breakdown')
    } else {
      setPostalData(postalResult.data?.postal_data || [])
    }

    if (!typeBreakdownResult.success) {
      setError((prev) => prev || typeBreakdownResult.error || 'Failed to load type breakdown')
    } else {
      setTypeBreakdownData(typeBreakdownResult.data || null)
    }

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
            onChange={(e) => 
              setRegion(e.target.value)
            }
            className="px-3 py-2 text-sm border rounded w-full sm:w-auto text-blue-800/80"
          >
            <option value="all">All</option>
            <option value="south">South Scottsdale</option>
            <option value="north">North Scottsdale</option>
          </select>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          <label className="text-xs sm:text-sm font-medium">Time Window:</label>
          <select
            value={timeWindow}
            onChange={(e) => {
              setIsCustomRange(false)
              setTimeWindow(Number(e.target.value))
            }}
            className="px-3 py-2 text-sm border rounded w-full sm:w-auto text-blue-600"
          >
            <option value={7}>Last 7 Days</option>
            <option value={14}>Last 14 Days</option>
            <option value={30}>Last 30 Days</option>
          </select>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          <label className="text-xs sm:text-sm font-medium">Start:</label>
          <input
            type="date"
            value={dateInputs.start}
            onChange={(e) => {
              setIsCustomRange(true)
              setDateInputs((prev) => ({ ...prev, start: e.target.value }))
            }}
            className="px-3 py-2 text-sm border rounded w-full sm:w-auto text-blue-800/80"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          <label className="text-xs sm:text-sm font-medium">End:</label>
          <input
            type="date"
            value={dateInputs.end}
            onChange={(e) => {
              setIsCustomRange(true)
              setDateInputs((prev) => ({ ...prev, end: e.target.value }))
            }}
            className="px-3 py-2 text-sm border rounded w-full sm:w-auto text-blue-800/80"
          />
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

      {hasLoadedOnce && kpiSummary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          <div className="bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Total Incidents</h3>
            <div className="text-2xl font-semibold">{kpiSummary.total_incidents ?? '-'}</div>
          </div>
          <div className="bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Avg Response (min)</h3>
            <div className="text-2xl font-semibold">
              {kpiSummary.avg_response_time_minutes != null
                ? Number(kpiSummary.avg_response_time_minutes).toFixed(1)
                : '-'}
            </div>
          </div>
          <div className="bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Active Units</h3>
            <div className="text-2xl font-semibold">{kpiSummary.active_units ?? '-'}</div>
          </div>
          <div className="bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Peak Load Factor</h3>
            <div className="text-2xl font-semibold">
              {kpiSummary.peak_load_factor != null
                ? Number(kpiSummary.peak_load_factor).toFixed(2)
                : '-'}
            </div>
          </div>
          <div className="bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Peak Hour</h3>
            <div className="text-2xl font-semibold">{kpiSummary.peak_hour ?? '-'}</div>
          </div>
        </div>
      )}

      {/* KPI Components Grid - Single column on mobile, 2 columns on large screens */}
      <div className="container p-4" ref={containerRef}> 
        <div className="slot top" data-swapy-slot="a">
          <div className="item item-a" data-swapy-item="a">
            <div className="handle" data-swapy-handle></div>
            <br />
            <div>DraggableUHU</div>
          </div> 
        </div>
        <div className="slot top2" data-swapy-slot="e" >
          <div className="item item-e" data-swapy-item="e">
            <div className="handle" data-swapy-handle></div>
            <br />
            <div>DraggableHeatMap</div>
          </div> 
        </div>
        <div className="middle">
          <div className="slot middle-left" data-swapy-slot="b" >
            <div className="item item-b" data-swapy-item="b">
              <div className="handle" data-swapy-handle></div>
              <div>DraggableCVLC</div>
            </div>
          </div>
          <div className="slot middle-right" data-swapy-slot="c" >
            <div className="item item-c" data-swapy-item="c">
              <div className="handle" data-swapy-handle></div>
              <div>DraggableBreakDown</div>
            </div>
          </div>
        </div>
        <div className="slot bottom" data-swapy-slot="d" >
          <div className="item item-d" data-swapy-item="d">
              <div className="handle" data-swapy-handle></div>
              <div>
                <div>DraggablePostal</div>
              </div>
          </div>
        </div>
    </div>
  </div>
  )
}

export default Dashboard