import { useMemo } from 'react';

const TOP_N = 8;

const COLORS = [
  'bg-orange-400', 'bg-amber-400', 'bg-yellow-400', 'bg-orange-300',
  'bg-amber-300', 'bg-yellow-300', 'bg-orange-200', 'bg-amber-200',
];

const IncidentTypeBreakdown = ({ data }) => {
  const stats = useMemo(() => {
    if (!data?.length) return null;

    const counts = new Map();
    data.forEach(row => {
      const type = row.incident_type || 'Unknown';
      counts.set(type, (counts.get(type) || 0) + 1);
    });

    const sorted = Array.from(counts.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, TOP_N);

    const total = data.length;
    return { rows: sorted, total };
  }, [data]);

  if (!stats || stats.rows.length === 0) {
    return (
      <div className="border rounded-lg p-4 bg-blue-500/40 backdrop-blur-md">
        <p className="text-gray-300">No incident type data available</p>
      </div>
    );
  }

  const maxCount = stats.rows[0]?.count || 1;

  return (
    <div className="border rounded-lg p-4 bg-white h-full">
      <h3 className="text-lg font-semibold mb-1">Incident Types</h3>
      <p className="text-sm text-gray-600 mb-3">
        {stats.total} total incidents
      </p>
      <div className="space-y-2">
        {stats.rows.map((row, i) => (
          <div key={row.type} className="flex items-center gap-2">
            <span className="text-xs w-20 text-right font-medium text-gray-700 truncate" title={row.type}>
              {row.type}
            </span>
            <div className="flex-1 h-5 bg-gray-100 rounded overflow-hidden">
              <div
                className={`h-full rounded ${COLORS[i % COLORS.length]}`}
                style={{ width: `${(row.count / maxCount) * 100}%` }}
              />
            </div>
            <span className="text-xs w-14 text-gray-600">
              {row.count} ({((row.count / stats.total) * 100).toFixed(0)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncidentTypeBreakdown;
