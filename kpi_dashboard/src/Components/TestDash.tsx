import { useEffect, useRef, useState } from 'react'
import './style.css'
import { Swapy } from 'swapy'
import { createSwapy } from 'swapy'
import HeatMapDayHour from './Dashboard/KPIs/HeatMapDayHour'
import UnitHourUtilization from './Dashboard/KPIs/UnitHourUtilization'
import CallVolumeLinearChart from './Dashboard/KPIs/CallVolumeLinearChart'
import Chart from './Dashboard/Chart'
import KPI_1 from './Dashboard/KPIs/KPI_1'

function TestDash() {

const [region, setRegion] = useState('south')
const [timeWindow, setTimeWindow] = useState(7)

function DraggableHeatMap(){

  const [expand, setExpand] = useState(() => {
    const initialExpand = true;
    console.log("Expand state set to " + initialExpand);
    return initialExpand;
  });

  return (
    <div className={"bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 rounded-lg " + (expand ? "col-span-2" : "col-span-1")}>
      <div className="flex items-center">
        <h3 className="font-semibold cursor-default mb-3">Heat Map: Incidents by Day × Hour</h3>
        <span title={expand ? 'Collapse Chart' : 'Expand Chart'} className="ml-auto flex items-center">
          <button onMouseUp={() => setExpand(!expand)} className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded">{expand ? '><' :
            '< >'}</button>
        </span>
      </div>
      <HeatMapDayHour data={mockIncidentData} region={region} />
    </div>
  )
}

function DraggableCVLC(){
  const [expand, setExpand] = useState(() => {
    const initialExpand = true;
    console.log("Expand state set to " + initialExpand);
    return initialExpand;
  });

  return (
    <div className={"bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 rounded-lg " + (expand ? "col-span-2" : "col-span-1")}>
          <div className="flex items-center">
            <h3 className="font-semibold mb-3">Call Volume Trend </h3>
            <span title={expand ? 'Collapse Chart' : 'Expand Chart'} className="ml-auto flex items-center">
              <button onMouseUp={() => setExpand(!expand)} className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded">{expand ? '><' :
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
  const [expand, setExpand] = useState(() => {
    const initialExpand = true;
    console.log("Expand state set to " + initialExpand);
    return initialExpand;
  });

  return (
    <div className="bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 rounded-lg ">
      <div className="flex items-center">
        <h3 className="font-semibold mb-3">Unit Hour Utilization (UHU)</h3>
        <span title={expand ? 'Collapse Chart' : 'Expand Chart'} className="ml-auto flex items-center">
          <button onMouseUp={handleClick} className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded">{expand ? '><' :
            '< >'}</button>
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
    <div className="container p-4" ref={containerRef}>
      <div className="slot top" data-swapy-slot="a">
        <div className="item item-a" data-swapy-item="a">
          <div className="handle" data-swapy-handle></div>
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
        <div className="slot middle-right" data-swapy-slot="c">
          <div className="item item-c" data-swapy-item="c">
            <div className="handle" data-swapy-handle></div>
            <DraggableHeatMap />
          </div>
        </div>
      </div>
      <div className="slot bottom" data-swapy-slot="d">
        <div className="item item-d" data-swapy-item="d">
            <div className="handle" data-swapy-handle></div>
            <div>D</div>
        </div>
      </div>
    </div>
  )
}

export default TestDash