import React, { useState } from 'react'
import HeatMapDayHour from './Dashboard/KPIs/HeatMapDayHour'
import UnitHourUtilization from './Dashboard/KPIs/UnitHourUtilization'
import CallVolumeLinearChart from './Dashboard/KPIs/CallVolumeLinearChart'
import Chart from './Dashboard/Chart'
import KPI_1 from './Dashboard/KPIs/KPI_1'
import KPI_2 from './Dashboard/KPIs/KPI_2'
import KPI_3 from './Dashboard/KPIs/KPI_3'
import KPI_4 from './Dashboard/KPIs/KPI_4'
import { DndContext, useDraggable, useDroppable, pointerWithin } from '@dnd-kit/core'
import GridLayout from 'react-grid-layout';

// Mock data for development
const mockIncidentData = [
  { timestamp: '2025-11-20T08:00:00', postal_code: 85250, unit_id: 'E101', en_route_time: '2025-11-20T08:05:00', clear_time: '2025-11-20T08:50:00' },
  { timestamp: '2025-11-20T09:30:00', postal_code: 85280, unit_id: 'R202', en_route_time: '2025-11-20T09:35:00', clear_time: '2025-11-20T11:35:00' },
  { timestamp: '2025-11-20T14:15:00', postal_code: 85250, unit_id: 'E101', en_route_time: '2025-11-20T14:20:00', clear_time: '2025-11-20T14:50:00' },
  { timestamp: '2025-11-21T10:00:00', postal_code: 85270, unit_id: 'LA301', en_route_time: '2025-11-21T10:05:00', clear_time: '2025-11-21T11:35:00' },
  { timestamp: '2025-11-21T16:45:00', postal_code: 85250, unit_id: 'E101', en_route_time: '2025-11-21T16:55:00', clear_time: '2025-11-21T18:35:00' },
]

function DraggableHeatMap(region){
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: 'heat-map' });
  
  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined
  };

  const [expand, setExpand] = useState(() => {
    const initialExpand = true;
    console.log("Expand state set to " + initialExpand);
    return initialExpand;
  });

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style} className={"bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 rounded-lg " + (expand ? "col-span-2" : "col-span-1")}>
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
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: 'kpi-1' });
  
  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined
  };

  const [expand, setExpand] = useState(() => {
    const initialExpand = true;
    console.log("Expand state set to " + initialExpand);
    return initialExpand;
  });

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style} className={"bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 rounded-lg " + (expand ? "col-span-2" : "col-span-1")}>
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
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: 'kpi-2' });
  
  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined
  };

  const [expand, setExpand] = useState(() => {
    const initialExpand = true;
    console.log("Expand state set to " + initialExpand);
    return initialExpand;
  });

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style} className={"bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 rounded-lg " + (expand ? "col-span-2" : "col-span-1")}>
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
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: 'kpi-3' });
  
  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined
  };

  const [expand, setExpand] = useState(() => {
    const initialExpand = true;
    console.log("Expand state set to " + initialExpand);
    return initialExpand;
  });

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style} className={"bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 rounded-lg " + (expand ? "col-span-2" : "col-span-1")}>
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
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: 'kpi-4' });
  
  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined
  };

  const [expand, setExpand] = useState(() => {
    const initialExpand = true;
    console.log("Expand state set to " + initialExpand);
    return initialExpand;
  });

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style} className={"bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 rounded-lg " + (expand ? "col-span-2" : "col-span-1")}>
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
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: 'uahu' });
  
  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined
  };

  const [expand, setExpand] = useState(() => {
    const initialExpand = true;
    console.log("Expand state set to " + initialExpand);
    return initialExpand;
  });

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style} className={"bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 rounded-lg " + (expand ? "col-span-2" : "col-span-1")}>
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
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: 'cvlc' });
  
  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined
  };

  const [expand, setExpand] = useState(() => {
    const initialExpand = true;
    console.log("Expand state set to " + initialExpand);
    return initialExpand;
  });

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style} className={"bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 rounded-lg " + (expand ? "col-span-2" : "col-span-1")}>
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

const Dashboard = () => {
  const [region, setRegion] = useState('south')
  const [timeWindow, setTimeWindow] = useState(7)
  const [isDropped, setIsDropped] = useState(false);

  
  function handleDragEnd(event){
    setIsDropped(true);
    // Logic to handle the end of a drag event
    console.log("Drag ended")
  }

  const layout = [
      { i: "uhu", x: 0, y: 0, w: 1, h: 2 },
      { i: "cvlc", x: 2, y: 0, w: 1, h: 2},
      { i: "heatmap", x: 4, y: 0, w: 1, h: 2 }
    ];

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

      {/* KPI Components Grid - Single column on mobile, 2 columns on large screens */}
      {/*<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
         <DraggableUHU />
        <DraggableCVLC region={region} />
        <DraggableHeatMap region={region} />
        <DraggableKPI_1 region={region} />
        <DraggableKPI_2 region={region} />
        <DraggableKPI_3 region={region} />
        <DraggableKPI_4 region={region} />

        {/* Placeholder for additional charts or KPIs - Currently hidden from view */}
        <GridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={30}
        width={1200}
      >
        <div key="uhu"><DraggableUHU handleDragEnd={handleDragEnd} /></div>
        <div key="cvlc"><DraggableCVLC region={region} /></div>
        <div key="heatmap"><DraggableHeatMap region={region} /></div>
      </GridLayout>
        <div className="hidden col-span-1 lg:col-span-2 bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 rounded-lg">
          <Chart />
      </div>
    </div>
  )
}

export default Dashboard