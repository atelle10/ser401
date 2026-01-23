import React, { useMemo } from 'react'
import { calculateIncidentVolume, filterByRegion } from './kpiCalculations'
import TrendIndicator from './TrendIndicator'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'

const KPI_2 = ({ data = [], timeWindow = 7 * 24 * 60 * 60 * 1000, region = null, loading = false, error = null, onRetry }) => {
  const stats = useMemo(() => {
    const filtered = region ? filterByRegion(data, region) : data;
    return calculateIncidentVolume(filtered, timeWindow);
  }, [data, timeWindow, region]);

  if (loading) {
    return (
      <div className="p-2 rounded-2xl justify-center bg-blue-50 shadow-blue-500/20 shadow-md h-32 flex flex-col items-center">
        <LoadingSpinner color="blue" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-2 rounded-2xl justify-center bg-blue-50 shadow-blue-500/20 shadow-md h-32 flex flex-col items-center">
        <ErrorMessage message={error} onRetry={onRetry} color="blue" />
      </div>
    );
  }

  return (
    <div>
        <div className="p-2 rounded-2xl justify-center bg-blue-50 shadow-blue-500/20 shadow-md h-32 flex flex-col items-center">
            <h2 className="text-lg text-blue-500/40 font-semibold">Total Incident Volume</h2>
            <p className="text-2xl text-blue-500 font-bold">{stats.count}</p>
            <div className="flex items-center gap-1">
                <TrendIndicator value={stats.trend} />
                <p className="text-sm text-gray-500">incidents</p>
            </div>
        </div>
    </div>
  )
}

export default KPI_2
