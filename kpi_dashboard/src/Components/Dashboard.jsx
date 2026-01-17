import React, { useState } from 'react'
import HeatMapDayHour from './Dashboard/KPIs/HeatMapDayHour'
import UnitHourUtilization from './Dashboard/KPIs/UnitHourUtilization'
import CallVolumeLinearChart from './Dashboard/KPIs/CallVolumeLinearChart'
import Chart from './Dashboard/Chart'

// Mock data for development
const mockIncidentData = [
  { timestamp: '2025-11-20T08:00:00', unit: 'E101', incident_type: 'EMS', duration: 45, postal_code: 85250, en_route_time: '2025-11-20T08:05:00', clear_time: '2025-11-20T08:50:00', unit_id: 'E101' },
  { timestamp: '2025-11-20T09:30:00', unit: 'R202', incident_type: 'Fire', duration: 120, postal_code: 85280, en_route_time: '2025-11-20T09:35:00', clear_time: '2025-11-20T11:35:00', unit_id: 'R202' },
  { timestamp: '2025-11-20T14:15:00', unit: 'E101', incident_type: 'EMS', duration: 30, postal_code: 85250, en_route_time: '2025-11-20T14:20:00', clear_time: '2025-11-20T14:50:00', unit_id: 'E101' },
  { timestamp: '2025-11-21T10:00:00', unit: 'LA301', incident_type: 'EMS', duration: 60, postal_code: 85270, en_route_time: '2025-11-21T10:05:00', clear_time: '2025-11-21T11:35:00', unit_id: 'LA301' },
  { timestamp: '2025-11-21T16:45:00', unit: 'E101', incident_type: 'Fire', duration: 90, postal_code: 85250, en_route_time: '2025-11-21T16:55:00', clear_time:' 2025-11-21T18:35:00', unit_id:' E101' },
]

const Dashboard = () => {
  const [region, setRegion] = useState('south')
  const [timeWindow, setTimeWindow] = useState(7)

  return (
    <div className="p-2 sm:p-4 space-y-4 sm:space-y-6">
      {/* Filters - Stack on mobile, side-by-side on larger screens */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-3 sm:p-4 rounded-lg">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          <label className="text-xs sm:text-sm font-medium">Region:</label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="px-3 py-2 text-sm border rounded w-full sm:w-auto text-blue-600"
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 rounded-lg">
          <h3 className="font-semibold mb-3">Heat Map: Incidents by Day × Hour</h3>
          <HeatMapDayHour incidents={mockIncidentData} region={region} weeks={1} />
        </div>

        <div className="bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 rounded-lg ">
          <h3 className="font-semibold mb-3">Unit Hour Utilization (UHU)</h3>
          <UnitHourUtilization incidents={mockIncidentData} />
        </div>

        <div className="col-span-1 lg:col-span-2 bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 rounded-lg">
          <h3 className="font-semibold mb-3">Call Volume Trend</h3>
          <CallVolumeLinearChart 
            data={mockIncidentData} 
            region={region}
            granularity="daily"
          />
        </div>

        <div className="col-span-1 lg:col-span-2 bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 rounded-lg">
          <Chart />
        </div>
      </div>
    </div>
  )
}

export default Dashboard