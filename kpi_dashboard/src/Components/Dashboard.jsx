<<<<<<< HEAD
import React from 'react';
import KPI_1 from './Dashboard/KPIs/KPI_1';
import KPI_2 from './Dashboard/KPIs/KPI_2';
import KPI_3 from './Dashboard/KPIs/KPI_3';
import KPI_4 from './Dashboard/KPIs/KPI_4';
import Chart from './Dashboard/Chart';
import HeatMapDayHour from './Dashboard/KPIs/HeatMapDayHour';
import UnitHourUtilization from './Dashboard/KPIs/UnitHourUtilization';
import CallVolumeLinearChart from './Dashboard/KPIs/CallVolumeLinearChart';

// Mock data for development (keep from 560 for charts to work)
const mockIncidentData = [
  { timestamp: '2025-11-20T08:00:00', unit: 'E101', incident_type: 'EMS', duration: 45, postal_code: 85250, en_route_time: '2025-11-20T08:05:00', clear_time: '2025-11-20T08:50:00', unit_id: 'E101' },
  { timestamp: '2025-11-20T09:30:00', unit: 'R202', incident_type: 'Fire', duration: 120, postal_code: 85280, en_route_time: '2025-11-20T09:35:00', clear_time: '2025-11-20T11:35:00', unit_id: 'R202' },
  { timestamp: '2025-11-20T14:15:00', unit: 'E101', incident_type: 'EMS', duration: 30, postal_code: 85250, en_route_time: '2025-11-20T14:20:00', clear_time: '2025-11-20T14:50:00', unit_id: 'E101' },
  { timestamp: '2025-11-21T10:00:00', unit: 'LA301', incident_type: 'EMS', duration: 60, postal_code: 85270, en_route_time: '2025-11-21T10:05:00', clear_time: '2025-11-21T11:35:00', unit_id: 'LA301' },
  { timestamp: '2025-11-21T16:45:00', unit: 'E101', incident_type: 'Fire', duration: 90, postal_code: 85250, en_route_time: '2025-11-21T16:55:00', clear_time: '2025-11-21T18:35:00', unit_id: 'E101' },
];
=======
import React from 'react'
import KPI_1 from './Dashboard/KPIs/KPI_1'
import KPI_2 from './Dashboard/KPIs/KPI_2'
import KPI_3 from './Dashboard/KPIs/KPI_3'
import KPI_4 from './Dashboard/KPIs/KPI_4'
import Chart from './Dashboard/Chart'
>>>>>>> d0a342e (Removed obsolute mock Register.jsx.)

const Dashboard = ({ role }) => {
  const canViewAdvanced = role === "admin" || role === "analyst";

  return (
    <div className="p-2 sm:p-4 space-y-4 sm:space-y-6">
      {/* Basic KPIs — always visible to all roles */}
      <div className="grid grid-cols-4 gap-4">
        <KPI_1 />
        <KPI_2 />
        <KPI_3 />
        <KPI_4 />
      </div>

      {/* Basic chart — always visible */}
      <div className="col-span-4">
        <Chart />
      </div>

      {/* Advanced analytics — analyst/admin only */}
      {canViewAdvanced && (
        <div className="col-span-4 mt-8">
          <h2 className="text-2xl font-bold mb-4">Advanced Analytics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Heat Map: Incidents by Day × Hour</h3>
              <HeatMapDayHour data={mockIncidentData} weeks={1} />
            </div>

            <div className="h-fit bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Unit Hour Utilization (UHU)</h3>
              <UnitHourUtilization data={mockIncidentData} />
            </div>

            <div className="col-span-1 lg:col-span-2 bg-blue-500/40 shadow-blue-500/20 shadow-md text-white p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Call Volume Trend</h3>
              <CallVolumeLinearChart 
                data={mockIncidentData} 
                granularity="daily"
              />
            </div>
          </div>
        </div>
      )}

      {/* Viewer message */}
      {role === "viewer" && (
        <div className="col-span-4 mt-8 text-center text-gray-600">
          <p>Basic dashboard view. Contact admin for elevated access.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;