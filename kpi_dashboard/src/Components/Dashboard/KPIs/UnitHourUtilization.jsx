import { useMemo } from 'react';

const UnitHourUtilization = ({ data, timePeriodHours = 24 }) => {
  
  const UNIT_TYPES = {
    R: { name: 'Rescue (Ambulances)', color: 'bg-blue-600', icon: '🚑' },
    E: { name: 'Engine (Fire Trucks)', color: 'bg-red-600', icon: '🚒' },
    LT: { name: 'Ladder Truck', color: 'bg-orange-600', icon: '🪜' },
    LA: { name: 'Low-Acuity EMS', color: 'bg-green-600', icon: '🚐' }
  };

  const uhuByUnit = useMemo(() => {
    if (!data?.length) return null;

    const unitHours = {};

    data.forEach(incident => {
      const unit = incident.unit_id;
      const dispatchTime = incident.dispatch_time || incident.en_route_time;
      const clearTime = incident.clear_time;
      if (!unit || !dispatchTime || !clearTime) return;

      const dispatch = new Date(dispatchTime);
      const clear = new Date(clearTime);
      
      if (clear <= dispatch || (clear - dispatch) > 24 * 60 * 60 * 1000) return;

      const busyHours = (clear - dispatch) / (1000 * 60 * 60);

      if (!unitHours[unit]) {
        unitHours[unit] = { busy: 0, count: 0, type: unit.charAt(0) };
      }
      unitHours[unit].busy += busyHours;
      unitHours[unit].count += 1;
    });

    const results = Object.entries(unitHours).map(([unit, stats]) => ({
      unit,
      type: stats.type,
      uhu: (stats.busy / timePeriodHours) * 100,
      busyHours: stats.busy.toFixed(1),
      incidents: stats.count
    }))
    .filter(entry => Number.isFinite(entry.uhu))
    .sort((a, b) => b.uhu - a.uhu);

    return results;
  }, [data, timePeriodHours]);

  if (!uhuByUnit?.length) {
    return (
      <div className="border rounded-lg p-4 bg-blue-500/40 backdrop-blur-md">
        <h3 className="text-lg font-semibold mb-2">Unit Hour Utilization (UHU)</h3>
        <p className="text-gray-300">No unit data available for the selected period</p>
      </div>
    );
  }

  const getUHUColor = (uhu) => {
    if (uhu >= 25) return 'text-orange-600 bg-orange-50';
    if (uhu >= 10) return 'text-green-600 bg-green-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="rounded-lg p-4 bg-blue-500/40 backdrop-blur-md">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Unit Hour Utilization (UHU)</h3>
        <p className="text-sm text-gray-300">
          UHU = (dispatch-to-clear busy time / {timePeriodHours}h period) * 100
        </p>
        <p className="text-xs text-gray-300">
          Source columns: unit_response.apparatus_resource_dispatch_date_time and unit_response.apparatus_resource_clear_date_time
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
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="font-bold text-gray-300">&lt; 10%</div>
            <div className="text-gray-200">Underutilized</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-green-600">10-25%</div>
            <div className="text-gray-200">Optimal</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-orange-600">25%+</div>
            <div className="text-gray-200">Busy</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitHourUtilization;
