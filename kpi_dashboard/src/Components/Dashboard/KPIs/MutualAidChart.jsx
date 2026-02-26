import { useEffect, useMemo, useState } from 'react';
import { fetchMutualAid } from '../../../services/incidentDataService';

const MutualAidChart = ({ startDate, endDate, region = 'all' }) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!startDate || !endDate) return;

    let cancelled = false;

    const load = async () => {
      const result = await fetchMutualAid({ startDate, endDate, region });
      if (!cancelled && result.success) {
        setStats(result.data);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [startDate, endDate, region]);

  const chartData = useMemo(() => {
    if (!stats) return null;

    const scottsdale = stats.scottsdale_units_outside || 0;
    const others = stats.other_units_in_scottsdale || 0;
    const max = Math.max(scottsdale, others, 1);

    const heightFor = (value) => {
      if (!value) return 0;
      const raw = (value / max) * 100;
      return Math.max(raw, 8);
    };

    return {
      scottsdale,
      others,
      max,
      scottsdaleHeight: heightFor(scottsdale),
      othersHeight: heightFor(others),
    };
  }, [stats]);

  if (!chartData) {
    return (
      <div className="border rounded-lg p-4 bg-white">
        <p className="text-gray-700">No mutual aid data available for the selected period</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-6 bg-white min-h-[200px] w-full">
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium text-gray-700">Scottsdale units outside</span>
            <span className="text-gray-600">{chartData.scottsdale}</span>
          </div>
          <div className="h-5 bg-gray-100 rounded overflow-hidden">
            <div
              className="h-full rounded bg-blue-700 transition-all"
              style={{ width: `${chartData.scottsdaleHeight}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium text-gray-700">Other units in Scottsdale</span>
            <span className="text-gray-600">{chartData.others}</span>
          </div>
          <div className="h-5 bg-gray-100 rounded overflow-hidden">
            <div
              className="h-full rounded bg-orange-400 transition-all"
              style={{ width: `${chartData.othersHeight}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-3 text-xs text-gray-600">
        Counts of unit responses in the selected date range and region.
      </div>
    </div>
  );
};

export default MutualAidChart;

