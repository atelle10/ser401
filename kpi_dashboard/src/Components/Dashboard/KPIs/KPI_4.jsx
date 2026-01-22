import React, { useMemo } from 'react'
import { calculatePeakLoadFactor, filterByRegion } from './kpiCalculations'
import TrendIndicator from './TrendIndicator'

const KPI_4 = ({ data = [], timeWindow = 7 * 24 * 60 * 60 * 1000, region = null }) => {
  const stats = useMemo(() => {
    const filtered = region ? filterByRegion(data, region) : data;
    return calculatePeakLoadFactor(filtered, timeWindow);
  }, [data, timeWindow, region]);

  const displayValue = stats.factor > 0 ? `${stats.factor.toFixed(2)}×` : 'N/A';
  const tooltipText = `Peak hour: ${stats.peakHour}:00 (${stats.peakCount} incidents vs ${stats.avgCount.toFixed(1)} avg)`;

  return (
    <div>
        <div className="p-2 rounded-2xl justify-center shadow-purple-500/20 bg-purple-50 shadow-md h-32 flex flex-col items-center" title={tooltipText}>
            <h2 className="text-lg text-purple-500/40 font-semibold">Peak Hour Load Factor</h2>
            <p className="text-2xl text-purple-500 font-bold">{displayValue}</p>
            <div className="flex items-center gap-1">
                <TrendIndicator value={stats.trend} />
                <p className="text-sm text-gray-500">Peak vs average load</p>
            </div>
        </div>
    </div>
  )
}

export default KPI_4
