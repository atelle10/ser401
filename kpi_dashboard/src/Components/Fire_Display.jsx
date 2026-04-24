import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import HeatMapDayHour from './Dashboard/KPIs/HeatMapDayHour'
import UnitHourUtilization from './Dashboard/KPIs/UnitHourUtilization'
import MutualAidChart from './Dashboard/KPIs/MutualAidChart'
import CallVolumeLinearChart from './Dashboard/KPIs/CallVolumeLinearChart'
import IncidentsByPostalCode from './Dashboard/KPIs/IncidentsByPostalCode'
import IncidentTypeBreakdown from './Dashboard/KPIs/IncidentTypeBreakdown'
import ResponseTimeBreakdown from './Dashboard/KPIs/ResponseTimeBreakdown'
import { fetchKPIData, fetchKPISummary, fetchIncidentHeatmap, fetchPostalBreakdown, fetchTypeBreakdown, fetchUnitOrigin, fetchResponseTimes } from '../services/incidentDataService'
import './assets/style.css'
import { motion } from 'motion/react'
import { Multiselect } from 'multiselect-react-dropdown'

export const formatDateInputValue = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const options = [
    { label: 'Call Volume Trend', value: 'call_volume_trend'},
    { label: 'Heatmap', value: 'heatmap'},
    { label: 'Unit Hour Utilization', value: 'unit_hour_utilization'},
    { label: 'Type Breakdown', value: 'type_breakdown'},
    { label: 'Postal Code', value: 'postal_code'},
    { label: 'Mutual Aid', value: 'mutual_aid'},
    { label: 'Response Time Breakdown', value: 'response_time_breakdown'}
  ]

export const buildIsoRangeFromDateInputs = ({ start, end }) => {
  if (!start || !end) return { startDate: null, endDate: null }

  const startDate = new Date(`${start}T00:00:00.000Z`).toISOString()
  const endDate = new Date(`${end}T23:59:59.999Z`).toISOString()
  return { startDate, endDate }
}

const defaultSettings = {
  enabled: false,
  rotationIntervalSeconds: 30,
  selectedCharts: options.map((option) => option.value),
  autoStartPlayback: false,
}



const FireDisplay = ({ role, settingss, }) => {
  const [region, setRegion] = useState('south')
  const [timeWindow, setTimeWindow] = useState(7)
  const [isCustomRange, setIsCustomRange] = useState(false)
  const [dateInputs, setDateInputs] = useState(() => {
  const end = new Date()
  const start = new Date(end.getTime() - timeWindow * 24 * 60 * 60 * 1000)
    return { start: formatDateInputValue(start), end: formatDateInputValue(end) }
  })
  const [incidentData, setIncidentData] = useState([])
  const [heatmapData, setHeatmapData] = useState(null)
  const [postalData, setPostalData] = useState(null)
  const [typeBreakdownData, setTypeBreakdownData] = useState(null)
  const [responseTimeData, setResponseTimeData] = useState(null)
  const [unitOriginData, setUnitOriginData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false)
  const [kpiSummary, setKpiSummary] = useState(null)
  const [settings, setSettings] = useState(defaultSettings)

  useEffect(() => {
      const stored = localStorage.getItem('tvModeSettings')
      if (!stored) {
        setSettings(defaultSettings)
        return        
      }

      try {
        const parsed = JSON.parse(stored)
        setSettings({
          ...defaultSettings,
          ...parsed,
          selectedCharts: Array.isArray(parsed.selectedCharts)
            ? parsed.selectedCharts.filter((value) =>
                options.some((option) => option.value === value)
              )
            : defaultSettings.selectedCharts,
        })
      } catch (error) {
        console.error('Failed to load TV mode settings:', error)
      }
    }, [])

  const dateRange = useMemo(() => {
    if (isCustomRange) {
      return buildIsoRangeFromDateInputs(dateInputs)
    }

    const end = new Date()
    const start = new Date(end.getTime() - timeWindow * 24 * 60 * 60 * 1000)
    return { startDate: start.toISOString(), endDate: end.toISOString() }
  }, [dateInputs, isCustomRange, timeWindow])

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

    const [incidentResult, summaryResult, heatmapResult, postalResult, typeBreakdownResult, unitOriginResult, responseTimesResult] = await Promise.all([
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
      fetchResponseTimes({
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

    if (!responseTimesResult.success) {
      setError((prev) => prev || responseTimesResult.error || 'Failed to load response time data')
    } else {
      setResponseTimeData(responseTimesResult.data || null)
    }

    setIsLoading(false)
  }, [dateRange.endDate, dateRange.startDate, region])

  const refreshPage = () => {
    window.location.reload();
  };

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
    "Mutual Aid",
    "Response Time Breakdown"
  ]
  const components  = [
    CallVolumeLinearChart,
    HeatMapDayHour,
    UnitHourUtilization,
    IncidentTypeBreakdown,
    IncidentsByPostalCode,
    MutualAidChart,
    ResponseTimeBreakdown
  ]

  const [omitComponents, setOmitComponents] = useState(options.map(opt => opt.value).filter(value => !settings.selectedCharts.includes(value)))
  const displayTitle = titles[currentIndex];
  const CurrentComponent = components[currentIndex];

  // Function to cycle to the next component and omit any that are not selected in the multiselect dropdown
  const goToNextComponent = () => {
    let index = currentIndex
    let nextIndex = (currentIndex + 1) % components.length;
    let tempIndex = components.findIndex((comp, idx) => idx === nextIndex && !omitComponents.includes(options[idx].value) && index !== idx);
    if(tempIndex > -1) {
      setCurrentIndex(tempIndex);
      return
    }
    while (tempIndex === -1) {
      nextIndex = (nextIndex + 1) % components.length;
      tempIndex = components.findIndex((comp, idx) => idx === nextIndex && !omitComponents.includes(options[idx].value) && index !== idx);
      if (tempIndex !== -1) {
        setCurrentIndex((prev) => tempIndex);
        return
      }
    } 
  };

  // Function to go back to the previous component and omit any that are not selected in the multiselect dropdown
  const goToPreviousComponent = () => {
    let index = currentIndex
    let prevIndex = (currentIndex - 1 + components.length) % components.length;
    let tempIndex = components.findIndex((comp, idx) => idx === prevIndex && !omitComponents.includes(options[idx].value) && index !== idx);
    if(tempIndex > -1) {
      setCurrentIndex(tempIndex);
      return
    }
    while (tempIndex === -1) {
      prevIndex = (prevIndex - 1 + components.length) % components.length;
      tempIndex = components.findIndex((comp, idx) => idx === prevIndex && !omitComponents.includes(options[idx].value) && index !== idx);
      if (tempIndex !== -1) {
        setCurrentIndex((prev) => tempIndex);
        return
      }
    }
  };

  // Slide duration and activation   
  const [activateSlideShow, setActivateSlideShow] = useState(settings.enabled || false)
  const [timer, setTimer] = useState(settings.enabled ? settings.rotationIntervalSeconds : 5) //Set initial timer duration to 5 seconds or value from settings

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

  const applySettings = () => {
    if (settings.enabled) {
      window.alert('Applying TV mode settings')
      setTimer(settings.rotationIntervalSeconds)
      setOmitComponents(options.map(opt => opt.value).filter(value => !settings.selectedCharts.includes(value)))
      setActivateSlideShow(settings.autoStartPlayback)
    } else {
      window.alert('TV mode settings applied but slideshow is not enabled. Please toggle play to start slideshow.')
      setOmitComponents(options.map(opt => opt.value).filter(value => !settings.selectedCharts.includes(value)))
    }
  }

  const selectRef = React.createRef()

  // useEffect to handle the slideshow functionality
  useEffect(() => {
    let interval = null;
    if (activateSlideShow) {
      interval = setInterval(goToNextComponent, (timer * 1000)); 
    }
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [currentIndex, timer, activateSlideShow]);

  return ( 
    <div className="sm:p-4 space-y-2 sm:space-y-4 h-full w-screen ">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1 sm:gap-4 bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-1 sm:p-4 rounded-lg">
        <div 
          className="text-center h-9 p-4 text-white text-xs font-semibold hover:bg-white transition-all duration-500 ease-in-out hover:-translate-y-1 hover:scale-110 hover:text-blue-800 cursor-pointer rounded-full flex justify-center items-center border-2 border-white"
          onClick={refreshPage}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg> 
          Back to Home
        </div>
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
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <label className="text-xs sm:text-sm font-medium">Charts Displayed:</label>
          <Multiselect
            ref={selectRef}
            selectedValues={options.filter(opt => !omitComponents.includes(opt.value)).map(opt => ({ value: opt.value, label: opt.label }))}
            options={options}
            onSelect={
              selectedList => {
                const selectedValues = selectedList.map(opt => opt.value)
                setOmitComponents(options.map(opt => opt.value).filter(value => !selectedValues.includes(value)))
              }
            }
            onRemove={
              selectedList => {
                const selectedValues = selectedList.map(opt => opt.value)
                setOmitComponents(options.map(opt => opt.value).filter(value => !selectedValues.includes(value)))
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
        <div className="flex flex-col ml-auto sm:flex-row sm:items-center gap-1 sm:gap-2">
          <label className="text-xs sm:text-sm font-medium">Rotation Interval (seconds)</label>
          <input
            type="number"
            min="10"
            max="300"
            step="5"
            value={timer}
            onChange={(e) => {
              const newValue = Number(e.target.value);
              newValue === 0 ? stopSlideShow() : handleTimerChange(newValue);
            }}
            className="px-3 py-2 text-sm border rounded w-full sm:w-auto text-blue-600"
          />
        </div>
        <div onClick={applySettings} title="Apply TV Mode Settings"
          className="text-center h-9 p-4 text-white text-xs font-semibold hover:bg-white transition-all duration-500 ease-in-out hover:-translate-y-1 hover:scale-110 hover:text-blue-800 cursor-pointer rounded-full flex justify-center items-center border-2 border-white"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125Z" />
            </svg>

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
          data={currentIndex === 4 ? postalData : currentIndex === 5 ? incidentData : typeBreakdownData} 
          heatmapData={heatmapData}
          weeks={1}
          overall={responseTimeData?.overall}
          perUnit={responseTimeData?.per_unit}
        />
      </motion.div>
  </div>)
}

export default FireDisplay