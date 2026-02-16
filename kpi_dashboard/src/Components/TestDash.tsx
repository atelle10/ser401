import { useEffect, useRef, useState } from 'react'
import './style.css'
import { Swapy } from 'swapy'
import { createSwapy } from 'swapy'
import HeatMapDayHour from './Dashboard/KPIs/HeatMapDayHour'
import UnitHourUtilization from './Dashboard/KPIs/UnitHourUtilization'
import CallVolumeLinearChart from './Dashboard/KPIs/CallVolumeLinearChart'

function TestDash() {

const [region, setRegion] = useState('south')
const [timeWindow, setTimeWindow] = useState(7)

function DraggableHeatMap(){

  const [expand, setExpand] = useState(true);

  return (
    <div className={"w-full h-fit bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 rounded-lg " + (expand ? "col-span-2" : "col-span-1")}>
      <div className="flex items-center">
        <h3 className="font-semibold cursor-default mb-3">Heat Map: Incidents by Day × Hour</h3>
        <span title={expand ? 'Collapse Chart' : 'Expand Chart'} className="ml-auto flex items-center">
          <button onClick={()=>{handleClick;setExpand(!expand)}}  className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded">{expand ? '><' :
            '< >'}</button>
        </span>
      </div>
      <HeatMapDayHour data={mockIncidentData} region={region} />
    </div>
  )
}

function DraggableCVLC(){
  const [expand, setExpand] = useState(true);

  return (
    <div className="w-full h-fit bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 rounded-lg ">
          <div className="flex items-center">
            <h3 className="font-semibold mb-3">Call Volume Trend </h3>
            <span title={expand ? 'Collapse Chart' : 'Expand Chart'} className="ml-auto flex items-center">
              <button onClick={()=>{handleClick;setExpand(!expand)}} className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded">{expand ? '><' :
                '< >'}</button>
            </span>
          </div>
          <CallVolumeLinearChart 
            data={mockIncidentData} 
            region={region}
            granularityImport="daily"
          />
        </div>
  )
}

const mockIncidentData = [
  { timestamp: '2025-11-20T08:00:00', postal_code: 85250, unit_id: 'E101', en_route_time: '2025-11-20T08:05:00', clear_time: '2025-11-20T08:50:00' },
  { timestamp: '2025-11-20T09:30:00', postal_code: 85280, unit_id: 'R202', en_route_time: '2025-11-20T09:35:00', clear_time: '2025-11-20T11:35:00' },
  { timestamp: '2025-11-20T14:15:00', postal_code: 85250, unit_id: 'E101', en_route_time: '2025-11-20T14:20:00', clear_time: '2025-11-20T14:50:00' },
  { timestamp: '2025-11-21T10:00:00', postal_code: 85270, unit_id: 'LA301', en_route_time: '2025-11-21T10:05:00', clear_time: '2025-11-21T11:35:00' },
  { timestamp: '2025-11-21T16:45:00', postal_code: 85250, unit_id: 'E101', en_route_time: '2025-11-21T16:55:00', clear_time: '2025-11-21T18:35:00' },
]


function DraggableUHU(){
  const [expand, setExpand] = useState(true);

  return (
    <div className="w-full h-fit bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 rounded-lg ">
      <div className="flex items-center">
        <h3 className="font-semibold mb-3">Unit Hour Utilization (UHU)</h3>
        <span title={expand ? 'Collapse Chart' : 'Expand Chart'} className="ml-auto flex items-center">
          <button onClick={()=>{setExpand(!expand);handleClick;}} className="myButton text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded">{expand ? '><' :
            '<>'}</button>
        </span>
      </div>
        <UnitHourUtilization data={mockIncidentData} />
    </div>
  )
}

  const swapyRef = useRef<Swapy | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)


  const [count,setCount] = useState(2)
  const [size, setSize] = useState({flex:1})


  const handleClick = () => {
    console.log(count)
    setSize({flex:count})
    count === 4  ? setCount(1): setCount(count+1);
  };


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
    <div className="container p-4" ref={containerRef}>
      <div className="slot top" data-swapy-slot="a" style={size}>
        <div className="item item-a" data-swapy-item="a">
          <div className="handle" data-swapy-handle></div>
          <br />
          <DraggableUHU />
        </div> 
      </div>
      <div className="middle">
        <div className="slot middle-left" data-swapy-slot="b" style={size}>
          <div className="item item-b" data-swapy-item="b">
            <div className="handle" data-swapy-handle></div>
            <DraggableCVLC />
          </div>
        </div>
        <div className="slot middle-right" data-swapy-slot="c" style={size}>
          <div className="item item-c" data-swapy-item="c">
            <div className="handle" data-swapy-handle></div>
            <DraggableHeatMap />
          </div>
        </div>
      </div>
      <div className="slot bottom" data-swapy-slot="d" style={size}>
        <div className="item item-d" data-swapy-item="d">
            <div className="handle" data-swapy-handle></div>
            <div>D</div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default TestDash