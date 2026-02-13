const COLORS = [
  'bg-orange-400', 'bg-amber-400', 'bg-yellow-400', 'bg-orange-300',
  'bg-amber-300', 'bg-yellow-300', 'bg-orange-200', 'bg-amber-200',
];

const IncidentTypeBreakdown = ({ data }) => {
  if (!data?.types?.length) {
    return (
      <div className="border rounded-lg p-4 bg-blue-500/40 backdrop-blur-md">
        <p className="text-gray-300">No incident type data available</p>
      </div>
    );
  }

  const maxCount = data.types[0]?.count || 1;

  return (
    <div className="border rounded-lg p-4 bg-white h-full">
      <h3 className="text-lg font-semibold mb-1">Incident Types</h3>
      <p className="text-sm text-gray-600 mb-3">
        {data.total_displayed} total incidents
      </p>
      <div className="space-y-2">
        {data.types.map((row, i) => (
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
              {row.count} ({row.percentage}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncidentTypeBreakdown;
