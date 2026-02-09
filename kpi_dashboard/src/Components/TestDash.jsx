import { createSwapy } from 'swapy'
import { Mosaic, MosaicWindow } from "react-mosaic-component";
import { useEffect, useRef, useState } from 'react'
import HeatMapDayHour from './Dashboard/KPIs/HeatMapDayHour'
import UnitHourUtilization from './Dashboard/KPIs/UnitHourUtilization'
import CallVolumeLinearChart from './Dashboard/KPIs/CallVolumeLinearChart'
import Chart from './Dashboard/Chart'
import KPI_1 from './Dashboard/KPIs/KPI_1'
import KPI_2 from './Dashboard/KPIs/KPI_2'
import KPI_3 from './Dashboard/KPIs/KPI_3'
import KPI_4 from './Dashboard/KPIs/KPI_4'

// Mock data for development
const mockIncidentData = [
  { timestamp: '2025-11-20T08:00:00', postal_code: 85250, unit_id: 'E101', en_route_time: '2025-11-20T08:05:00', clear_time: '2025-11-20T08:50:00' },
  { timestamp: '2025-11-20T09:30:00', postal_code: 85280, unit_id: 'R202', en_route_time: '2025-11-20T09:35:00', clear_time: '2025-11-20T11:35:00' },
  { timestamp: '2025-11-20T14:15:00', postal_code: 85250, unit_id: 'E101', en_route_time: '2025-11-20T14:20:00', clear_time: '2025-11-20T14:50:00' },
  { timestamp: '2025-11-21T10:00:00', postal_code: 85270, unit_id: 'LA301', en_route_time: '2025-11-21T10:05:00', clear_time: '2025-11-21T11:35:00' },
  { timestamp: '2025-11-21T16:45:00', postal_code: 85250, unit_id: 'E101', en_route_time: '2025-11-21T16:55:00', clear_time: '2025-11-21T18:35:00' },
]



function DraggableHeatMap(region){
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
      <HeatMapDayHour data={mockIncidentData} region={region} weeks={1} />
    </div>
  )
}

function DraggableKPI_1(region){

  const [expand, setExpand] = useState(() => {
    const initialExpand = true;
    console.log("Expand state set to " + initialExpand);
    return initialExpand;
  });

  return (
    <div className={"bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 rounded-lg " + (expand ? "col-span-2" : "col-span-1")}>
      <div className="flex items-center">
        <h3 className="font-semibold cursor-default mb-3">KPI 1</h3>
        <span title={expand ? 'Collapse Chart' : 'Expand Chart'} className="ml-auto flex items-center">
          <button onMouseUp={() => setExpand(!expand)} className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded">{expand ? '><' :
            '< >'}</button>
        </span>
      </div>
      <KPI_1 data={mockIncidentData} region={region}  />
    </div>
  )
}

function DraggableKPI_2(region){

  const [expand, setExpand] = useState(() => {
    const initialExpand = true;
    console.log("Expand state set to " + initialExpand);
    return initialExpand;
  });

  return (
    <div className={"bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 rounded-lg " + (expand ? "col-span-2" : "col-span-1")}>
      <div className="flex items-center">
        <h3 className="font-semibold cursor-default mb-3">KPI 2</h3>
        <span title={expand ? 'Collapse Chart' : 'Expand Chart'} className="ml-auto flex items-center">
          <button onMouseUp={() => setExpand(!expand)} className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded">{expand ? '><' :
            '< >'}</button>
        </span>
      </div>
      <KPI_2 data={mockIncidentData} region={region} />
    </div>
  )
}

function DraggableKPI_3(region){
  const [expand, setExpand] = useState(() => {
    const initialExpand = true;
    console.log("Expand state set to " + initialExpand);
    return initialExpand;
  });

  return (
    <div className={"bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 rounded-lg " + (expand ? "col-span-2" : "col-span-1")}>
      <div className="flex items-center">
        <h3 className="font-semibold cursor-default mb-3">KPI 3</h3>
        <span title={expand ? 'Collapse Chart' : 'Expand Chart'} className="ml-auto flex items-center">
          <button onMouseUp={() => setExpand(!expand)} className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded">{expand ? '><' :
            '< >'}</button>
        </span>
      </div>
      <KPI_3 data={mockIncidentData} region={region} />
    </div>
  )
}

function DraggableKPI_4(region){

  const [expand, setExpand] = useState(() => {
    const initialExpand = true;
    console.log("Expand state set to " + initialExpand);
    return initialExpand;
  });

  return (
    <div className={"bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 rounded-lg " + (expand ? "col-span-2" : "col-span-1")}>
      <div className="flex items-center">
        <h3 className="font-semibold cursor-default mb-3">KPI 4</h3>
        <span title={expand ? 'Collapse Chart' : 'Expand Chart'} className="ml-auto flex items-center">
          <button onMouseUp={() => setExpand(!expand)} className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded">{expand ? '><' :
            '< >'}</button>
        </span>
      </div>
      <KPI_4 data={mockIncidentData} region={region}  />
    </div>
  )
}


function DraggableUHU(){
  const [expand, setExpand] = useState(() => {
    const initialExpand = true;
    console.log("Expand state set to " + initialExpand);
    return initialExpand;
  });

  return (
    <div className={"bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 rounded-lg " + (expand ? "col-span-2" : "col-span-1")}>
      <div className="flex items-center">
        <h3 className="font-semibold mb-3">Unit Hour Utilization (UHU)</h3>
        <span title={expand ? 'Collapse Chart' : 'Expand Chart'} className="ml-auto flex items-center">
          <button onMouseUp={() => {setExpand(!expand); handleDragEnd();}} className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded">{expand ? '><' :
            '< >'}</button>
        </span>
      </div>
        <UnitHourUtilization data={mockIncidentData} />
    </div>
  )
}

function DraggableCVLC(region){
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
            granularity="daily"
          />
        </div>
  )
}


const TITLE_MAP = {
  "Call Volume Linear Chart": <DraggableCVLC />,
  "Unit Hour Utilization": <DraggableUHU /> ,
  "Heat Map": <DraggableHeatMap />,
  new: "New Window"
};

const TestDash = () => (
  <Mosaic
    renderTile={(id, path) => (
      <MosaicWindow path={path} createNode={() => "new"} title={id}>
        <h1>{TITLE_MAP[id]}</h1>
      </MosaicWindow>
    )}
    initialValue={{
      direction: "row",
      first: "Heat Map",
      second: {
        direction: "column",
        first: "Unit Hour Utilization",
        second: "Call Volume Linear Chart"
      }
    }}
  />
);

export default TestDash