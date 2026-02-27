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
import { Multiselect } from 'multiselect-react-dropdown'

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



const Dashboard = ({ role = "viewer" }) => {
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
  const [heatmapVisible, setHeatmapVisible] = useState(true)
  const [postalCodeVisible, setPostalCodeVisible] = useState(true)
  const [unitHourUtilizationVisible, setUnitHourUtilizationVisible] = useState(true)
  const [callVolumeVisible, setCallVolumeVisible] = useState(true)
  const [typeBreakdownVisible, setTypeBreakdownVisible] = useState(true)


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
          })
          swapyRef.current.onBeforeSwap((event) => {
            return true
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


  const options = [
            { label: 'Heatmap', value: 'heatmap' },
            { label: 'Postal Code', value: 'postal_code' },
            { label: 'Type Breakdown', value: 'type_breakdown' },
            { label: 'Unit Hour Utilization', value: 'unit_hour_utilization' },
            { label: 'Call Volume Trend', value: 'call_volume_trend' },
          ]
  const isAnalystOrAdmin = ["analyst", "admin"].includes(role)
  const isAdmin = role === "admin"
  const selectRef = React.createRef()

  return (
    <div className="p-2 sm:p-4 space-y-4 sm:space-y-6">
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


        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          <label className="text-xs sm:text-sm font-medium">Charts Displayed:</label>
          <Multiselect
          ref={selectRef}
          selectedValues={options}
          options={options}
          onSelect={
            selectedList => {
              const selectedValues = selectedList.map(opt => opt.value)
              setHeatmapVisible(selectedValues.includes('heatmap'))
              setPostalCodeVisible(selectedValues.includes('postal_code'))
              setTypeBreakdownVisible(selectedValues.includes('type_breakdown'))
              setUnitHourUtilizationVisible(selectedValues.includes('unit_hour_utilization'))
              setCallVolumeVisible(selectedValues.includes('call_volume_trend'))
            }
          }
          onRemove={
            selectedList => {
              const selectedValues = selectedList.map(opt => opt.value)
              setHeatmapVisible(selectedValues.includes('heatmap'))
              setPostalCodeVisible(selectedValues.includes('postal_code'))
              setTypeBreakdownVisible(selectedValues.includes('type_breakdown'))
              setUnitHourUtilizationVisible(selectedValues.includes('unit_hour_utilization'))
              setCallVolumeVisible(selectedValues.includes('call_volume_trend'))
            }
          }
          avoidHighlightFirstOption={true}
          displayValue='label'
          showCheckbox={true}
          hideSelectedList={true}
          placeholder='Search charts...'
          style={{
              multiselectContainer: {
                color: 'blue',
                background: 'transparent',
              },
               searchBox: {
                color: 'blue',
                background: 'white',
              }
          }}
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
        <div data-testid="basic-kpis" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
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

      {isAnalystOrAdmin && (
        <div data-testid="advanced-analytics" className="container p-4" ref={containerRef}> 
        <div className="slot top" data-swapy-slot="a">
          <div className="item item-a" data-swapy-item="a">
            <div className="handle" data-swapy-handle></div>
            <div className={heatmapVisible ? 'hidden' : 'visible'  }>
              <br />
              <button onClick={() => {
                setHeatmapVisible(true); 
                console.log(selectRef.current.getSelectedItems());
                selectRef.current.selectedValues = [...selectRef.current.getSelectedItems(), options.filter(value => value.value === 'heatmap')[0]];
                console.log(options.filter(item => item.value === 'heatmap')[0]);  
                console.log(selectRef.current.selectedValues);
                selectRef.current.onSelect();
                console.log(selectRef.current.selectedValues)
                }} 
                title='Display Heat Map'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg> 
              </button>
            </div>
            <div className={ "w-full bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 rounded-lg "+ (heatmapVisible ? 'visible' : 'hidden') }>
              <br />
              <h3 className="font-semibold mb-3 text-center">Heat Map: Incidents by Day × Hour</h3>
              <HeatMapDayHour data={incidentData} heatmapData={heatmapData} region={region} weeks={1} />
            </div>
          </div> 
        </div>
        <div className="slot top2" data-swapy-slot="e" >
          <div className="item item-e" data-swapy-item="e">
            <div className="handle" data-swapy-handle></div>
            <div className={"w-full bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 rounded-lg " + (callVolumeVisible ? 'visible' : 'hidden')} >
               <br />
              <h3 className="font-semibold mb-3 text-center">Call Volume Trend</h3>
              <CallVolumeLinearChart
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
                region={region}
              />
            </div>
          </div> 
        </div>
        <div className="middle">
          <div className="slot middle-left" data-swapy-slot="b" >
            <div className="item item-b" data-swapy-item="b">
              <div className="handle" data-swapy-handle></div>
              <div className={"w-full bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 rounded-lg "+ (unitHourUtilizationVisible ? 'visible' : 'hidden')}>
               <br />
              <h3 className="font-semibold mb-3 text-center">Unit Hour Utilization (UHU)</h3>
              <UnitHourUtilization data={incidentData} />
            </div>
            </div>
          </div>
          <div className="slot middle-right" data-swapy-slot="c" >
            <div className="item item-c" data-swapy-item="c">
              <div className="handle" data-swapy-handle></div>
                <div className={"w-full bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 rounded-lg "+ (postalCodeVisible ? 'visible' : 'hidden')}>
                <br />
                <h3 className="font-semibold mb-3 text-center">Incidents by Postal Code</h3>
                <IncidentsByPostalCode data={postalData} />
              </div>
            </div>
          </div>
        </div>
        <div className="slot bottom" data-swapy-slot="d" >
          <div className="item item-d" data-swapy-item="d">
              <div className="handle" data-swapy-handle></div>
              <div className={"w-full bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 rounded-lg "+ (typeBreakdownVisible ? 'visible' : 'hidden')}>
               <br />
              <h3 className="font-semibold mb-3 text-center">Incident Type Breakdown</h3>
              <IncidentTypeBreakdown data={typeBreakdownData} />
            </div>
          </div>
        </div>
  </div>
  )
}
  </div>)
}

export default Dashboard
