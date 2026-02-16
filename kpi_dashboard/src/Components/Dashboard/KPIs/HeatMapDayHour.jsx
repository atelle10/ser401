import { useMemo, useState } from 'react';

/**
 * Heat map showing incident volume by day of week x hour of day.
 * 
 * Why separate South/North views: Urban (South) vs rural (North) areas have 
 * dramatically different call patterns. South peaks during rush hour, North
 * peaks on weekends due to outdoor activities.
 */
const HeatMapDayHour = ({ data , region}) => {
  const [selectedWeeks, setSelectedWeeks] = useState(5);
  const regionState = region;

  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const HOURS = Array.from({ length: 24 }, (_, i) => i);

  // Build heat map grid - O(n) single pass instead of nested loops per cell
  const heatData = useMemo(() => {
    if (!data?.length) return null;

    const grid = Array(7).fill(null).map(() => Array(24).fill(0));
    const now = new Date();
    const cutoff = new Date(now.getTime() - selectedWeeks * 7 * 24 * 60 * 60 * 1000);

    let maxCount = 0;

    data.forEach(incident => {
      const incidentDate = new Date(incident.timestamp);
      if (incidentDate < cutoff) return;
      
      // Regional filter - postal codes define urban vs rural
      const isTargetRegion = regionState === 'south' 
        ? incident.postal_code < 85260  // South Scottsdale urban codes
        : incident.postal_code >= 85260; // North Scottsdale rural codes
      
      if (!isTargetRegion) return;

      const day = incidentDate.getDay();
      const hour = incidentDate.getHours();
      
      grid[day][hour]++;
      maxCount = Math.max(maxCount, grid[day][hour]);
    });

    return { grid, maxCount };
  }, [data, region, selectedWeeks]);

  if (!heatData) {
    return (
      <div className="border rounded-lg p-4 bg-white">
        <p className="text-gray-500">No incident data available</p>
      </div>
    );
  }

  // Color intensity based on percentage of max - more intuitive than absolute values
  const getColor = (count) => {
    if (count === 0) return 'bg-gray-50';
    const intensity = Math.ceil((count / heatData.maxCount) * 5);
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-blue-200 text-blue-800', 
      'bg-blue-400 text-blue-800',
      'bg-blue-600 text-blue-800',
      'bg-blue-800 text-white'
    ];
    return colors[Math.min(intensity - 1, 4)];
  };
;
  return (
    <div className="cursor-default border rounded-lg p-4 bg-blue-500/40 backdrop-blur-md">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold">
            Incident Volume Heat Map - {regionState === 'south' ? 'South Scottsdale' : 'North Scottsdale'}
          </h3>
          <p className="text-sm text-gray-600">Day of Week × Hour of Day</p>
        </div>
        
        <select 
          value={selectedWeeks}
          onChange={(e) => setSelectedWeeks(Number(e.target.value))}
          className="border rounded px-3 py-1 text-sm text-blue-800/80"
        >
          <option value={1}>Last week</option>
          <option value={5}>Last 5 weeks</option>
          <option value={12}>Last 12 weeks</option>
        </select>
      </div>

      <div className="overflow-x-auto text-blue-800/80">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2 bg-gray-100 text-xs sticky left-0">Hour</th>
              {DAYS.map(day => (
                <th key={day} className="border p-2 bg-gray-100 text-xs font-medium">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HOURS.map(hour => (
              <tr key={hour}>
                <td className="border p-2 bg-gray-50 text-xs font-medium text-right sticky left-0">
                  {hour.toString().padStart(2, '0')}:00
                </td>
                {DAYS.map((_, dayIdx) => {
                  const count = heatData.grid[dayIdx][hour];
                  return (
                    <td
                      key={dayIdx}
                      className={`border p-3 ${getColor(count)} transition-colors cursor-pointer hover:opacity-60`}
                      title={`${DAYS[dayIdx]} ${hour}:00 - ${count} incidents`}
                    >
                      <span className="text-xs font-medium">{count || ''}</span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center gap-4 text-xs text-">
        <span>Low</span>
        <div className="flex gap-1">
          {['bg-gray-50', 'bg-blue-100', 'bg-blue-200', 'bg-blue-400', 'bg-blue-600', 'bg-blue-800'].map((color, i) => (
            <div key={i} className={`w-6 h-4 ${color} border`}></div>
          ))}
        </div>
        <span>High</span>
        <span className="ml-auto">Max: {heatData.maxCount} incidents/hour</span>
      </div>
    </div>
  );
};

export default HeatMapDayHour;
