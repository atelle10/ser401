import { useEffect, useMemo, useState } from 'react';
import { fetchMutualAid } from '../../../services/incidentDataService';

const formatDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return '';
  try {
    const s = new Date(startDate);
    const e = new Date(endDate);
    const opts = { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' };
    return `${s.toLocaleDateString('en-US', opts)} – ${e.toLocaleDateString('en-US', opts)}`;
  } catch {
    return '';
  }
};

const regionLabel = (r) => {
  if (r === 'south') return 'South Scottsdale';
  if (r === 'north') return 'North Scottsdale';
  return 'All';
};

const MutualAidChart = ({ startDate, endDate, region = 'all' }) => {
  const [stats, setStats] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOtherUnits, setShowOtherUnits] = useState(false);

  useEffect(() => {
    if (!startDate || !endDate) {
      setLoading(false);
      setStats(null);
      setLoadError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    setStats(null);

    const load = async () => {
      const result = await fetchMutualAid({ startDate, endDate, region });
      if (cancelled) return;
      setLoading(false);
      if (result.success) {
        setStats(result.data);
      } else {
        setLoadError(result.error || 'Failed to load');
        setStats(null);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [startDate, endDate, region]);

  useEffect(() => {
    setShowOtherUnits(false);
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

  const otherUnitsDetail = Array.isArray(stats?.other_units_in_scottsdale_detail)
    ? stats.other_units_in_scottsdale_detail
    : [];

  if (loading) {
    return (
      <div className="border rounded-lg p-4 bg-white">
        <p className="text-gray-700">Loading mutual aid…</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="border rounded-lg p-4 bg-white">
        <p className="text-red-700">{loadError}</p>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="border rounded-lg p-4 bg-white">
        <p className="text-gray-700">No mutual aid data available for the selected period</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-6 bg-white w-full">
      <div className="space-y-6">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-gray-700">Scottsdale units outside</span>
            <span className="font-semibold text-gray-800">{chartData.scottsdale}</span>
          </div>
          <div className="h-10 bg-gray-100 rounded overflow-hidden">
            <div
              className="h-full rounded bg-blue-700 transition-all"
              style={{ width: `${chartData.scottsdaleHeight}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-start gap-2 text-sm mb-2">
            <span className="font-medium text-gray-700">Other units in Scottsdale</span>
            <span className="font-semibold text-gray-800 shrink-0">{chartData.others}</span>
          </div>
          <div className="h-10 bg-gray-100 rounded overflow-hidden">
            <div
              className="h-full rounded bg-orange-400 transition-all"
              style={{ width: `${chartData.othersHeight}%` }}
            />
          </div>
          <div className="mt-2">
            <button
              type="button"
              onClick={() => setShowOtherUnits((v) => !v)}
              className="text-xs font-medium text-blue-700 hover:text-blue-900 underline-offset-2 hover:underline"
            >
              {showOtherUnits ? 'Hide' : 'See'} unit IDs in this count
            </button>
            {showOtherUnits && (
              <div className="mt-2 border border-gray-200 rounded-md overflow-hidden max-h-48 overflow-y-auto">
                {otherUnitsDetail.length === 0 ? (
                  <p className="text-xs text-gray-600 px-3 py-2">No rows for this selection.</p>
                ) : (
                  <table className="w-full text-xs text-left">
                    <thead className="bg-gray-50 text-gray-600 sticky top-0">
                      <tr>
                        <th className="px-3 py-1.5 font-medium">Unit ID</th>
                        <th className="px-3 py-1.5 font-medium text-right">Responses</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {otherUnitsDetail.map((row) => (
                        <tr key={row.unit_id} className="text-gray-800">
                          <td className="px-3 py-1 font-mono">{row.unit_id}</td>
                          <td className="px-3 py-1 text-right tabular-nums">{row.response_count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                <p className="text-[11px] text-gray-500 px-3 py-2 border-t border-gray-100 bg-gray-50/80">
                  {regionLabel(region)} · non-Scottsdale units in Scottsdale ZIPs; Maricopa Ambulance (M-*)
                  excluded.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-600">
        Counts for {formatDateRange(startDate, endDate)} · {regionLabel(region)}.
      </div>
    </div>
  );
};

export default MutualAidChart;

