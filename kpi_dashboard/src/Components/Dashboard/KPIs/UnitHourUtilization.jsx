import { useMemo } from 'react';

/**
 * Unit Hour Utilization (UHU) - Critical metric for resource allocation.
 * 
 * Why this matters: Leadership needs to justify staffing levels and equipment.
 * High UHU (>0.8) = understaffed, Low UHU (<0.3) = overstaffed.
 * 
 * Formula: (time from "en route" to "clear") / (total shift time)
 * - "en route" = unit dispatched to incident
 * - "clear" = unit available again
 */
const UnitHourUtilization = ({ data, timePeriodHours = 24 }) => {
  
  const UNIT_TYPES = {
    R: { name: 'Rescue (Ambulances)', color: 'bg-blue-600', icon: '🚑' },
    E: { name: 'Engine (Fire Trucks)', color: 'bg-red-600', icon: '🚒' },
    LT: { name: 'Ladder Truck', color: 'bg-orange-600', icon: '🪜' },
    LA: { name: 'Low-Acuity EMS', color: 'bg-green-600', icon: '🚐' }
  };

  // Calculate UHU per unit - single pass O(n)
  const uhuByUnit = useMemo(() => {
    if (!data?.length) return null;

    const unitHours = {}; // Track busy hours per unit

    data.forEach(incident => {
      const unit = incident.unit_id;
      if (!unit || !incident.en_route_time || !incident.clear_time) return;

      const enRoute = new Date(incident.en_route_time);
      const clear = new Date(incident.clear_time);
      
      // Sanity check - reject impossible times (data quality issue)
      if (clear <= enRoute || (clear - enRoute) > 24 * 60 * 60 * 1000) return;

      const busyHours = (clear - enRoute) / (1000 * 60 * 60);

      if (!unitHours[unit]) {
        unitHours[unit] = { busy: 0, count: 0, type: unit.charAt(0) };
      }
      unitHours[unit].busy += busyHours;
      unitHours[unit].count += 1;
    });

    // Calculate UHU percentage
    const results = Object.entries(unitHours).map(([unit, stats]) => ({
      unit,
      type: stats.type,
      uhu: (stats.busy / timePeriodHours) * 100,
      busyHours: stats.busy.toFixed(1),
      incidents: stats.count
    })).sort((a, b) => b.uhu - a.uhu); // High to low

    return results;
  }, [data, timePeriodHours]);

  if (!uhuByUnit?.length) {
    return (
      <div className="border rounded-lg p-4 bg-blue-500/70 backdrop-blur-md">
        <h3 className="text-lg font-semibold mb-2">Unit Hour Utilization (UHU)</h3>
        <p className="text-gray-500">No unit data available</p>
      </div>
    );
  }

  // Color code by utilization level - industry thresholds
  const getUHUColor = (uhu) => {
    if (uhu >= 80) return 'text-red-600 bg-red-50';      // Overworked
    if (uhu >= 60) return 'text-orange-600 bg-orange-50'; // Busy
    if (uhu >= 30) return 'text-green-600 bg-green-50';   // Optimal
    return 'text-gray-600 bg-gray-50';                    // Underutilized
  };

  return (
    <div className="rounded-lg p-4 bg-blue-500/40 backdrop-blur-md">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Unit Hour Utilization (UHU)</h3>
        <p className="text-sm text-gray-300">
          Time period: {timePeriodHours}h • Higher = more resource demand
        </p>
      </div>

      <div className="space-y-2">
        {uhuByUnit.map(({ unit, type, uhu, busyHours, incidents }) => {
          const unitType = UNIT_TYPES[type] || UNIT_TYPES.R;
          
          return (
            <div 
              key={unit}
              className="flex items-center gap-3 p-3 border rounded hover:bg-blue-900/80 transition-colors"
            >
              <span className="text-2xl">{unitType.icon}</span>
              
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold">{unit}</span>
                  <span className="text-xs text-gray-200">{unitType.name}</span>
                </div>
                <div className="text-xs text-gray-300 mt-0.5">
                  {busyHours}h busy • {incidents} incidents
                </div>
              </div>

              <div className={`px-3 py-1.5 rounded font-bold text-lg ${getUHUColor(uhu)}`}>
                {uhu.toFixed(1)}%
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t">
        <div className="grid grid-cols-4 gap-2 text-xs">
          <div className="text-center">
            <div className="font-bold text-gray-300">&lt; 30%</div>
            <div className="text-gray-200">Underutilized</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-green-600">30-60%</div>
            <div className="text-gray-200">Optimal</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-orange-600">60-80%</div>
            <div className="text-gray-200">Busy</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-red-600">&gt; 80%</div>
            <div className="text-gray-200">Overworked</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitHourUtilization;
