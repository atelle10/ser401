import { useMemo, useState, useEffect } from 'react';
import { fetchCallVolume } from '../../../services/incidentDataService';

const CallVolumeLinearChart = ({ startDate, endDate, region = 'south' }) => {
  const [granularity, setGranularity] = useState('daily');
  const [trendData, setTrendData] = useState(null);

  useEffect(() => {
    if (!startDate || !endDate) return;

    let cancelled = false;

    const load = async () => {
      const result = await fetchCallVolume({ startDate, endDate, region, granularity });
      if (!cancelled && result.success) {
        setTrendData(result.data?.trend_data || []);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [startDate, endDate, region, granularity]);

  const chartData = useMemo(() => {
    if (!trendData?.length) return null;

    const points = trendData
      .filter(row => row.date !== null)
      .map(row => ({
        date: row.date.split('T')[0],
        count: row.count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    if (!points.length) return null;

    const maxCount = Math.max(...points.map(p => p.count));
    const avgCount = points.reduce((sum, p) => sum + p.count, 0) / points.length;

    return { points, maxCount, avgCount };
  }, [trendData]);

  if (!chartData) {
    return (
      <div className="border rounded-lg p-4 bg-blue-500/40 backdrop-blur-md">
        <h3 className="text-lg font-semibold mb-2">Call Volume Trend</h3>
        <p className="text-gray-300">No call volume data available for the selected period</p>
      </div>
    );
  }

  const width = 800;
  const height = 300;
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const xDenom = Math.max(1, chartData.points.length - 1);
  const xScale = (index) => (index / xDenom) * chartWidth;
  const yScale = (count) => chartHeight - (count / chartData.maxCount) * chartHeight;

  const linePath = chartData.points
    .map((point, i) => {
      const x = padding.left + xScale(i);
      const y = padding.top + yScale(point.count);
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    })
    .join(' ');

  const avgY = padding.top + yScale(chartData.avgCount);

  const labelStep = Math.ceil(chartData.points.length / 10);
  const xLabels = chartData.points.filter((_, i) => i % labelStep === 0);

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold">
            Call Volume Trend - {region === 'south' ? 'South (Urban)' : region === 'north' ? 'North (Rural)' : 'All Regions'}
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
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        style={{ maxHeight: '400px' }}
      >
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

        <path
          d={linePath}
          fill="none"
          stroke="#2563eb"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

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
