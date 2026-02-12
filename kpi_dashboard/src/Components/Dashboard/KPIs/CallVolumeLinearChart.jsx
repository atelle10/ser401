import { useMemo, useState } from 'react';

/**
 * Linear trend chart for call volume over time.
 * 
 * Why linear vs heat map: Heat map shows patterns, linear shows trends.
 * Leadership wants to see if volumes are increasing (need more staff)
 * or decreasing (budget cuts justified).
 */
const CallVolumeLinearChart = ({ data, region, granularityImport}) => {
  const [granularity, setGranularity] = useState(granularityImport ? granularityImport : "daily"); // daily, weekly, monthly
  const regionState = region.region;
  // Aggregate data by time period
  
  const chartData = useMemo(() => {
    if (!data?.length) return null;

    const buckets = new Map();
    const now = new Date();
    const daysBack = granularity === 'daily' ? 30 : granularity === 'weekly' ? 84 : 365;
    const cutoff = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);

    data.forEach(incident => {
      const incidentDate = new Date(incident.timestamp);
      // Time filter commented out for debugging/testing
      // if (incidentDate < cutoff) return;

      // Regional filter
      const isTargetRegion = regionState === 'south' 
        ? incident.postal_code < 85260 
        : incident.postal_code >= 85260;

        if (!isTargetRegion) return;

      // Bucket by granularity
      let key;
      if (granularity === 'daily') {
        key = incidentDate.toISOString().split('T')[0]; // YYYY-MM-DD
      } else if (granularity === 'weekly') {
        const weekStart = new Date(incidentDate);
        weekStart.setDate(incidentDate.getDate() - incidentDate.getDay());
        key = weekStart.toISOString().split('T')[0];
      } else {
        key = `${incidentDate.getFullYear()}-${String(incidentDate.getMonth() + 1).padStart(2, '0')}`;
      }

      buckets.set(key, (buckets.get(key) || 0) + 1);
    });
    // Convert to array and sort
    const points = Array.from(buckets.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    if (!points.length) return null;

    const maxCount = Math.max(...points.map(p => p.count));
    const avgCount = points.reduce((sum, p) => sum + p.count, 0) / points.length;

    return { points, maxCount, avgCount };
  }, [data, region, granularity]);

  if (!chartData) {
    return (
      <div className="border rounded-lg p-4 bg-white">
        <p className="text-gray-500">No call volume data available</p>
      </div>
    );
  }

  // SVG dimensions - responsive within container
  const width = 800;
  const height = 300;
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const xScale = (index) => (index / (chartData.points.length - 1)) * chartWidth;
  const yScale = (count) => chartHeight - (count / chartData.maxCount) * chartHeight;

  // Build SVG path - single string for performance
  const linePath = chartData.points
    .map((point, i) => {
      const x = padding.left + xScale(i);
      const y = padding.top + yScale(point.count);
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    })
    .join(' ');

  // Average line
  const avgY = padding.top + yScale(chartData.avgCount);

  // X-axis labels - show every Nth point to avoid overlap
  const labelStep = Math.ceil(chartData.points.length / 10);
  const xLabels = chartData.points.filter((_, i) => i % labelStep === 0);

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-black">
            Call Volume Trend - {regionState === 'south' ? 'South (Urban)' : 'North (Rural)'}
          </h3>
          <p className="text-sm text-gray-600">
            Average: {chartData.avgCount.toFixed(1)} calls/{granularity === 'daily' ? 'day' : granularity === 'weekly' ? 'week' : 'month'}
          </p>
        </div>

        <select 
          value={granularity}
          onChange={(e) => setGranularity(e.target.value)}
          className="border rounded px-3 py-1 text-sm"
        >
          <option value="daily">Daily (30 days)</option>
          <option value="weekly">Weekly (12 weeks)</option>
          <option value="monthly">Monthly (12 months)</option>
        </select>
      </div>

      <svg 
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        style={{ maxHeight: '400px' }}
      >
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map(percent => {
          const y = padding.top + chartHeight * (1 - percent);
          return (
            <g key={percent}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
              <text
                x={padding.left - 10}
                y={y + 4}
                textAnchor="end"
                fontSize="12"
                fill="#6b7280"
              >
                {Math.round(chartData.maxCount * percent)}
              </text>
            </g>
          );
        })}

        {/* Average line */}
        <line
          x1={padding.left}
          y1={avgY}
          x2={width - padding.right}
          y2={avgY}
          stroke="#3b82f6"
          strokeWidth="1"
          strokeDasharray="5,5"
          opacity="0.5"
        />

        {/* Main trend line */}
        <path
          d={linePath}
          fill="none"
          stroke="#2563eb"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {chartData.points.map((point, i) => {
          const x = padding.left + xScale(i);
          const y = padding.top + yScale(point.count);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="3"
              fill="#2563eb"
              className="cursor-pointer hover:r-5 transition-all"
            >
              <title>{`${point.date}: ${point.count} calls`}</title>
            </circle>
          );
        })}

        {/* X-axis labels */}
        {xLabels.map((point, i) => {
          const originalIndex = chartData.points.indexOf(point);
          const x = padding.left + xScale(originalIndex);
          const displayDate = granularity === 'monthly' 
            ? point.date.slice(0, 7) 
            : point.date.slice(5);
          
          return (
            <text
              key={i}
              x={x}
              y={height - padding.bottom + 20}
              textAnchor="middle"
              fontSize="11"
              fill="#6b7280"
            >
              {displayDate}
            </text>
          );
        })}

        {/* Y-axis label */}
        <text
          x={-height / 2}
          y={15}
          transform="rotate(-90)"
          textAnchor="middle"
          fontSize="12"
          fill="#374151"
          fontWeight="500"
        >
          Call Volume
        </text>
      </svg>
    </div>
  );
};

export default CallVolumeLinearChart;
