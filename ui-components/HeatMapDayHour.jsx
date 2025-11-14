import { useMemo, useState } from 'react';

/**
 * Heat map showing incident volume by day of week x hour of day.
 * 
 * Why separate South/North views: Urban (South) vs rural (North) areas have 
 * dramatically different call patterns. South peaks during rush hour, North
 * peaks on weekends due to outdoor activities.
 */
const HeatMapDayHour = ({ data, region = 'south' }) => {
  const [selectedWeeks, setSelectedWeeks] = useState(5);

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
      const isTargetRegion = region === 'south' 
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

  // TODO: Add color intensity logic and rendering
  return <div>Heat map coming soon...</div>;
};

export default HeatMapDayHour;
