import React, { useMemo } from 'react'
import { calculateActiveUnits, filterByRegion } from './kpiCalculations'
import TrendIndicator from './TrendIndicator'

const KPI_3 = ({ data = [], timeWindow = 7 * 24 * 60 * 60 * 1000, region = null }) => {
  const stats = useMemo(() => {
    const filtered = region ? filterByRegion(data, region) : data;
    return calculateActiveUnits(filtered, timeWindow);
  }, [data, timeWindow, region]);

  const breakdownText = `E:${stats.breakdown.engine} R:${stats.breakdown.rescue} L:${stats.breakdown.ladder}`;

  return (
    <div>
        <div className="p-2 rounded-2xl justify-center bg-green-50 shadow-green-500/20 shadow-md h-32 flex flex-col items-center" title={breakdownText}>
            <h2 className="text-lg text-green-500/40 font-semibold">Active Units Count</h2>
            <p className="text-2xl text-green-500 font-bold">{stats.total}</p>
            <div className="flex items-center gap-1">
                <TrendIndicator value={stats.trend} />
                <p className="text-sm text-gray-500">Unique units deployed</p>
            </div>
        </div>
    </div>
  )
}

export default KPI_3
