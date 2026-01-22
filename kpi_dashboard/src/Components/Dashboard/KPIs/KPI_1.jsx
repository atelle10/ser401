import React, { useMemo } from 'react'
import { calculateAvgResponseTime, filterByRegion } from './kpiCalculations'
import TrendIndicator from './TrendIndicator'

const KPI_1 = ({ data = [], timeWindow = 7 * 24 * 60 * 60 * 1000, region = null }) => {
  const stats = useMemo(() => {
    const filtered = region ? filterByRegion(data, region) : data;
    return calculateAvgResponseTime(filtered, timeWindow);
  }, [data, timeWindow, region]);

  const displayValue = stats.value !== null ? `${stats.value.toFixed(2)} min` : 'N/A';

  return (
    <div>
        <div className="p-2 rounded-2xl justify-center bg-red-50 shadow-red-500/20 shadow-md h-32 flex flex-col items-center">
            <h2 className="text-lg text-red-500/40 font-semibold">Avg Response Time</h2>
            <p className="text-2xl text-red-500 font-bold">{displayValue}</p>
            <div className="flex items-center gap-1">
                <TrendIndicator value={stats.trend} inverse={true} />
                <p className="text-sm text-gray-500">Dispatch to arrival</p>
            </div>
        </div>
    </div>
  )
}

export default KPI_1
