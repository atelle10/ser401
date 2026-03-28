import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import HeatMapDayHour from './Dashboard/KPIs/HeatMapDayHour'
import UnitHourUtilization from './Dashboard/KPIs/UnitHourUtilization'
import MutualAidChart from './Dashboard/KPIs/MutualAidChart'
import CallVolumeLinearChart from './Dashboard/KPIs/CallVolumeLinearChart'
import IncidentsByPostalCode from './Dashboard/KPIs/IncidentsByPostalCode'
import IncidentTypeBreakdown from './Dashboard/KPIs/IncidentTypeBreakdown'
import { fetchKPIData, fetchKPISummary, fetchIncidentHeatmap, fetchPostalBreakdown, fetchTypeBreakdown, fetchUnitOrigin } from '../services/incidentDataService'
import { createSwapy } from 'swapy'
import './assets/style.css'
import { motion } from 'motion/react'
import homeIcon from './assets/home icon.png'

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
  const [heatmapData, setHeatmapData] = useState(null)
  const [postalData, setPostalData] = useState(null)

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

  // Slide duration and activation 
  const [activateSlideShow, setActivateSlideShow] = useState(false)
  const [timer, setTimer] = useState(5) //Set initial timer duration to 5 seconds 


  const togglePlayButton = () => {
    setActivateSlideShow(prevToggle => !prevToggle);
  }

  const stopSlideShow = () => {
    setActivateSlideShow(false)
  };

  const handleTimerChange = (inputValue) => {
    setActivateSlideShow(true) 
    setTimer(inputValue)
  }

  // useEffect to handle the slideshow functionality
  useEffect(() => {
    let interval = null;
    if (activateSlideShow) {
      interval = setInterval(goToNextComponent, (timer * 1000)); 
    }
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [currentIndex, timer, activateSlideShow]);

  return ( 
    <div className="sm:p-4 space-y-2 sm:space-y-4 w-screen h-screen">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1 sm:gap-4 bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-1 sm:p-4 rounded-lg">
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
        <div className="flex flex-col ml-auto sm:flex-row sm:items-center gap-1 sm:gap-2">
          <label className="text-xs sm:text-sm font-medium">Slide Duration:</label>
          <select
            value={timer}
            onChange={(e) => {
              const newValue = Number(e.target.value);
              newValue === 0 ? stopSlideShow() : handleTimerChange(newValue);
            }}
            className="px-3 py-2 text-sm border rounded w-full sm:w-auto text-blue-600"
          >
            <option value={0} >Manual</option>
            <option value={5}>5 Seconds</option>
            <option value={10}>10 Seconds</option>
            <option value={30}>30 Seconds</option>
            <option value={60}>1 Minute</option>
            <option value={300}>5 Minutes</option>
            <option value={600}>10 Minutes</option>
          </select>
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
          className={"h-8 p-4 ml-auto w-fit bg-blue-500/40 text-white font-semibold hover:bg-blue-700 cursor-pointer rounded-xl flex justify-center items-center my-1" +(activateSlideShow ? 'visible' : 'hidden')}
          onClick={togglePlayButton}
          >
            <span>{activateSlideShow ? 'Pause' :  'Play'}</span>
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
  </div>)
}

export default FireDisplay
