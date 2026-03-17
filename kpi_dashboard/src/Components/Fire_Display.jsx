import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import HeatMapDayHour from './Dashboard/KPIs/HeatMapDayHour'
import UnitHourUtilization from './Dashboard/KPIs/UnitHourUtilization'
import UnitHourUtilizationByOrigin from './Dashboard/KPIs/UnitHourUtilizationByOrigin'
import MutualAidChart from './Dashboard/KPIs/MutualAidChart'
import CallVolumeLinearChart from './Dashboard/KPIs/CallVolumeLinearChart'
import IncidentsByPostalCode from './Dashboard/KPIs/IncidentsByPostalCode'
import IncidentTypeBreakdown from './Dashboard/KPIs/IncidentTypeBreakdown'
import Chart from './Dashboard/Chart'
import KPI_1 from './Dashboard/KPIs/KPI_1'
import LoadingSpinner from './Dashboard/KPIs/LoadingSpinner'
import ErrorMessage from './Dashboard/KPIs/ErrorMessage'
import { fetchKPIData, fetchKPISummary, fetchIncidentHeatmap, fetchPostalBreakdown, fetchTypeBreakdown, fetchUnitOrigin } from '../services/incidentDataService'
import { createSwapy } from 'swapy'
import './assets/style.css'
import { Multiselect } from 'multiselect-react-dropdown'
import { motion } from 'motion/react'
import Dashboard from './Dashboard'
import homeIcon from './assets/home icon.png'
import { Link, useNavigate } from 'react-router-dom';

export const formatDateInputValue = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const buildIsoRangeFromDateInputs = ({ start, end }) => {
  if (!start || !end) return { startDate: null, endDate: null }

  const startDate = new Date(`${start}T00:00:00.000Z`).toISOString()
  const endDate = new Date(`${end}T23:59:59.999Z`).toISOString()
  return { startDate, endDate }
}



const FireDisplay = ({ role }) => {
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
  const [unitOriginData, setUnitOriginData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false)
  const [heatmapVisible, setHeatmapVisible] = useState(true)
  const [postalCodeVisible, setPostalCodeVisible] = useState(true)
  const [unitHourUtilizationVisible, setUnitHourUtilizationVisible] = useState(true)
  const [callVolumeVisible, setCallVolumeVisible] = useState(true)
  const [typeBreakdownVisible, setTypeBreakdownVisible] = useState(true)
  const [mutualAidVisible, setMutualAidVisible] = useState(true)
  const [selectKey, setSelectKey] = useState(0)

  const refreshPage = () => {
    window.location.reload();
  };

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

    const [incidentResult, summaryResult, heatmapResult, postalResult, typeBreakdownResult, unitOriginResult] = await Promise.all([
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
      fetchUnitOrigin({
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

    if (!unitOriginResult.success) {
      setError((prev) => prev || unitOriginResult.error || 'Failed to load unit origin data')
    } else {
      setUnitOriginData(unitOriginResult.data || null)
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
            { label: 'Mutual Aid', value: 'mutual_aid' },
          ]
  const [selectedCharts, setSelectedCharts] = useState(options)


  const isAnalystOrAdmin = ["analyst", "admin"].includes(role)
  const isAdmin = role === "admin"
  const selectRef = React.createRef()


  const [currentIndex, setCurrentIndex] = useState(0);
  const titles = [
    "Call Volume Trend",
    "Heat Map: Incidents by Day × Hour",
    "Unit Hour Utilization",
    "Incident Type Breakdown",
    "Incidents by Postal Code",
    "Mutual Aid"
  ]
  const components = [
    CallVolumeLinearChart, 
    HeatMapDayHour, 
    UnitHourUtilization,
    IncidentTypeBreakdown,
    IncidentsByPostalCode,
    MutualAidChart
  ];

  const displayTitle = titles[currentIndex]
  const CurrentComponent = components[currentIndex]; // Store the active component
  // Function to cycle to the next component
  const goToNextComponent = () => {
    setCurrentIndex((prevIndex) =>
      (prevIndex + 1) % components.length // Loop back to the start if at the end
    );
  };

  // Function to go back (optional)
  const goToPreviousComponent = () => {
    setCurrentIndex((prevIndex) =>
      (prevIndex - 1 + components.length) % components.length
    );
  };

  return ( 
    <div className="sm:p-4 space-y-4 sm:space-y-6 w-screen h-screen">
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
        <div 
          className="ml-auto h-8 p-2 text-white hover:bg-white transition-all duration-500 ease-in-out hover:-translate-y-1 hover:scale-110 hover:text-blue-800 cursor-pointer rounded-full flex justify-center items-center my-1"
          onClick={refreshPage}
        >
            <img src={homeIcon} title='Return to Home' alt="Home Icon" className='inline w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7'/>
        </div>
      </div>
    
      <div className='flex flex-row'>
        <motion.button 
          whileHover={{scale: 1.05, y: -3}}
          whileTap={{scale:0.9, y: 1}}
          className="h-8 p-4 w-fit bg-blue-500/40 text-white font-semibold hover:bg-blue-700 cursor-pointer rounded-xl flex justify-center items-center my-1"
          onClick={goToPreviousComponent}
        > Previous 
        </motion.button>

        <motion.button 
          whileHover={{scale: 1.05, y: -3}}
          whileTap={{scale:0.9, y: 1}}
          className="ml-auto h-8 p-4 w-fit bg-blue-500/40 text-white font-semibold hover:bg-blue-700 cursor-pointer rounded-xl flex justify-center items-center my-1"
          onClick={goToNextComponent}
        > Next 
        </motion.button>
      </div>

      <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-blue-500/40 shadow-blue-500/20 shadow-md text-white rounded-lg p-2">
        <span className="font-semibold justify-center">{displayTitle}</span>
        <CurrentComponent 
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          region={region}
          data={currentIndex === 4 ? postalData : incidentData} 
          heatmapData={heatmapData}
          weeks={1}
        />
      </motion.div>

      {/* <div data-testid="advanced-analytics" className="container" ref={containerRef}> 
        <div className="slot top" data-swapy-slot="a">
          <div className="item item-a" data-swapy-item="a">
            <div className="handle" data-swapy-handle></div>
            <div className={heatmapVisible ? 'hidden' : 'visible'  }>
              <br />
              <button onClick={() => {
                setHeatmapVisible(true);
                setSelectedCharts(prev => [...prev, options.filter(value => value.value === 'heatmap')[0]]); 
                setSelectKey(prevKey => prevKey + 1);
                }} 
                title='Display Heat Map'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg> 
              </button>
            </div>
            <div className={ "w-full bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 rounded-lg "+ (heatmapVisible ? 'visible' : 'hidden') }>
              <div className="right-align-button">
                <button onClick={() => {
                  setHeatmapVisible(false);
                  setSelectedCharts(prev => prev.filter(chart => chart.value !== 'heatmap'));
                  setSelectKey(prevKey => prevKey + 1);
                  }} 
                  title='Minimize Heat Map'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <h3 className="font-semibold mb-3 text-center">Heat Map: Incidents by Day × Hour</h3>
              
            </div>
          </div> 
        </div>
        <div className="slot top2" data-swapy-slot="e" >
          <div className="item item-e" data-swapy-item="e">
            <div className="handle" data-swapy-handle></div>
            <div className={callVolumeVisible ? 'hidden' : 'visible'  }>
              <br />
              <button onClick={() => {
                setCallVolumeVisible(true);
                setSelectedCharts(prev => [...prev, options.filter(value => value.value === 'call_volume_trend')[0]]); 
                setSelectKey(prevKey => prevKey + 1);
                }} 
                title='Display Call Volume Trend'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg> 
              </button>
            </div>
            <div className={"w-full bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 rounded-lg " + (callVolumeVisible ? 'visible' : 'hidden')} >
              <div className="right-align-button">
                <button onClick={() => {
                  setCallVolumeVisible(false);
                  setSelectedCharts(prev => prev.filter(chart => chart.value !== 'call_volume_trend'));
                  setSelectKey(prevKey => prevKey + 1);
                  }} 
                  title='Minimize Call Volume Trend'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
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
              <div className={unitHourUtilizationVisible ? 'hidden' : 'visible'  }>
              <br />
              <button onClick={() => {
                setUnitHourUtilizationVisible(true);
                setSelectedCharts(prev => [...prev, options.filter(value => value.value === 'unit_hour_utilization')[0]]); 
                setSelectKey(prevKey => prevKey + 1);
                }} 
                title='Display Unit Hour Utilization'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg> 
              </button>
            </div>
              <div className={"w-full bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 rounded-lg "+ (unitHourUtilizationVisible ? 'visible' : 'hidden')}>
               <div className="right-align-button">
                <button onClick={() => {
                  setUnitHourUtilizationVisible(false);
                  setSelectedCharts(prev => prev.filter(chart => chart.value !== 'unit_hour_utilization'));
                  setSelectKey(prevKey => prevKey + 1);
                  }} 
                  title='Minimize Unit Hour Utilization'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <h3 className="font-semibold mb-3 text-center">Unit Hour Utilization (UHU)</h3>
              <UnitHourUtilization data={incidentData} />
            </div>
            </div>
          </div>
          <div className="slot middle-right" data-swapy-slot="c" >
            <div className="item item-c" data-swapy-item="c">
              <div className="handle" data-swapy-handle></div>
              <div className={postalCodeVisible ? 'hidden' : 'visible'  }>
              <br />
              <button onClick={() => {
                setPostalCodeVisible(true);
                setSelectedCharts(prev => [...prev, options.filter(value => value.value === 'postal_code')[0]]); 
                setSelectKey(prevKey => prevKey + 1);
                }} 
                title='Display Postal Code'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg> 
              </button>
            </div>
                <div className={"w-full bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 rounded-lg "+ (postalCodeVisible ? 'visible' : 'hidden')}>
                <div className="right-align-button">
                <button onClick={() => {
                  setPostalCodeVisible(false);
                  setSelectedCharts(prev => prev.filter(chart => chart.value !== 'postal_code'));
                  setSelectKey(prevKey => prevKey + 1);
                  }} 
                  title='Minimize Postal Code'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
                <h3 className="font-semibold mb-3 text-center">Incidents by Postal Code</h3>
                <IncidentsByPostalCode data={postalData} />
              </div>
            </div>
          </div>
        </div>
        <div className="slot bottom" data-swapy-slot="d" >
          <div className="item item-d" data-swapy-item="d">
              <div className="handle" data-swapy-handle></div>
              <div className={typeBreakdownVisible ? 'hidden' : 'visible'  }>
              <br />
              <button onClick={() => {
                setTypeBreakdownVisible(true);
                setSelectedCharts(prev => [...prev, options.filter(value => value.value === 'type_breakdown')[0]]); 
                setSelectKey(prevKey => prevKey + 1);
                }} 
                title='Display Type Breakdown'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg> 
              </button>
            </div>
              <div className={"w-full bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 rounded-lg "+ (typeBreakdownVisible ? 'visible' : 'hidden')}>
                <div className="right-align-button">
                <button onClick={() => {
                  setTypeBreakdownVisible(false);
                  setSelectedCharts(prev => prev.filter(chart => chart.value !== 'type_breakdown'));
                  setSelectKey(prevKey => prevKey + 1);
                  }} 
                  title='Minimize Type Breakdown'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <h3 className="font-semibold mb-3 text-center">Incident Type Breakdown</h3>
              <IncidentTypeBreakdown data={typeBreakdownData} />
            </div>
          </div>
        </div>
        <div className="slot bottom2" data-swapy-slot="f" >
          <div className="item item-f" data-swapy-item="f">
              <div className="handle" data-swapy-handle></div>
              <div className={mutualAidVisible ? 'hidden' : 'visible'  }>
              <br />
              <button onClick={() => {
                setMutualAidVisible(true);
                setSelectedCharts(prev => [...prev, options.filter(value => value.value === 'mutual_aid')[0]]); 
                setSelectKey(prevKey => prevKey + 1);
                }} 
                title='Display Mutual Aid'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg> 
              </button>
            </div>
              <div className={"w-full bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 rounded-lg "+ (mutualAidVisible ? 'visible' : 'hidden')}>
                <div className="right-align-button">
                <button onClick={() => {
                  setMutualAidVisible(false);
                  setSelectedCharts(prev => prev.filter(chart => chart.value !== 'mutual_aid'));
                  setSelectKey(prevKey => prevKey + 1);
                  }} 
                  title='Minimize Mutual Aid'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <h3 className="font-semibold mb-3 text-center">Incident Mutual Aid</h3>
              <MutualAidChart startDate={dateInputs.start} endDate={dateInputs.end} />
            </div>
          </div>
        </div> 
    </div>*/}
  </div>)
}

export default FireDisplay
