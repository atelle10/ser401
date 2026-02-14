import { useMemo } from 'react';

const TOP_N = 10;

const IncidentsByPostalCode = ({ data }) => {
  const stats = useMemo(() => {
    if (!data?.length) return null;

    const rows = data.map(row => ({
      zip: row.zip,
      count: row.count,
      avgResponse: row.avg_response_minutes,
    }));

    const byCount = [...rows].sort((a, b) => b.count - a.count).slice(0, TOP_N);
    const byResponse = rows
      .filter(r => r.avgResponse !== null)
      .sort((a, b) => b.avgResponse - a.avgResponse)
      .slice(0, TOP_N);

    return { byCount, byResponse };
  }, [data]);

  if (!stats || stats.byCount.length === 0) {
    return (
      <div className="border rounded-lg p-4 bg-blue-500/40 backdrop-blur-md">
        <p className="text-gray-300">No postal code data available for the selected period</p>
      </div>
    );
  }

  const maxCount = stats.byCount[0]?.count || 1;
  const maxResponse = stats.byResponse[0]?.avgResponse || 1;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="border rounded-lg p-4 bg-white">
        <h3 className="text-lg font-semibold mb-1">Top {stats.byCount.length} Postal Codes by Incident Count</h3>
        <div className="space-y-2 mt-3">
          {stats.byCount.map(row => (
            <div key={row.zip} className="flex items-center gap-2">
              <span className="text-xs w-12 text-right font-medium text-gray-700">{row.zip}</span>
              <div className="flex-1 h-5 bg-gray-100 rounded overflow-hidden">
                <div
                  className="h-full rounded bg-orange-400"
                  style={{ width: `${(row.count / maxCount) * 100}%` }}
                />
              </div>
              <span className="text-xs w-10 text-gray-600">{row.count}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3">Number of Incidents</p>
      </div>

      <div className="border rounded-lg p-4 bg-white">
        <h3 className="text-lg font-semibold mb-1">Avg Response Time by Postal Code (Top {stats.byResponse.length} Areas)</h3>
        <div className="space-y-2 mt-3">
          {stats.byResponse.map(row => (
            <div key={row.zip} className="flex items-center gap-2">
              <span className="text-xs w-12 text-right font-medium text-gray-700">{row.zip}</span>
              <div className="flex-1 h-5 bg-gray-100 rounded overflow-hidden">
                <div
                  className="h-full rounded bg-blue-400"
                  style={{ width: `${(row.avgResponse / maxResponse) * 100}%` }}
                />
              </div>
              <span className="text-xs w-10 text-gray-600">{row.avgResponse.toFixed(1)}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3">Avg Response Time (minutes)</p>
      </div>
    </div>
  );
};

export default IncidentsByPostalCode;
