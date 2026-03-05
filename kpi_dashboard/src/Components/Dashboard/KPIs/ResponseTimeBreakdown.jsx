import React, { useMemo, useState } from 'react'

const formatMinutes = (value, suffix = true) => {
  if (value == null || Number.isNaN(value)) return '—'
  const num = value.toFixed(1)
  return suffix ? `${num} min` : num
}

const METRIC_LABELS = {
  call_processing: {
    title: 'Call processing time',
    description: 'From call received (PSAP) to dispatch',
  },
  turnout: {
    title: 'Turnout time',
    description: 'From dispatch to leaving the station (en route)',
  },
  travel: {
    title: 'Travel time',
    description: 'From leaving the station (en route) to arrival on scene',
  },
}

const ResponseTimeBreakdown = ({ overall, perUnit }) => {
  const [sortConfig, setSortConfig] = useState({
    key: 'travel_p90',
    direction: 'desc',
  })

  const sortedRows = useMemo(() => {
    if (!perUnit?.length) return []

    const rows = [...perUnit]
    const { key, direction } = sortConfig

    rows.sort((a, b) => {
      const aVal = a[key] ?? -Infinity
      const bVal = b[key] ?? -Infinity
      if (aVal === bVal) return 0
      const base = aVal < bVal ? -1 : 1
      return direction === 'asc' ? base : -base
    })

    return rows
  }, [perUnit, sortConfig])

  const handleSort = (key) => {
    setSortConfig((current) => {
      if (current.key === key) {
        return {
          key,
          direction: current.direction === 'asc' ? 'desc' : 'asc',
        }
      }
      return { key, direction: 'desc' }
    })
  }

  const hasData = overall && perUnit && perUnit.length > 0

  if (!hasData) {
    return (
      <div className="border rounded-lg p-4 bg-blue-500/40 backdrop-blur-md">
        <h3 className="text-lg font-semibold mb-2">Response Time Breakdown</h3>
        <p className="text-gray-200 text-sm">
          No qualifying response-time data for this time window and region.
        </p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg p-4 bg-white h-full flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-semibold mb-1">Response Time Breakdown</h3>
        <p className="text-xs text-gray-500">
          Times shown in minutes; 90th percentile is the time such that 90% of responses are faster than or equal to it.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {Object.entries(METRIC_LABELS).map(([key, meta]) => {
          const metric = overall?.[key] || {}
          return (
            <div
              key={key}
              className="rounded-lg bg-blue-500/10 border border-blue-200 p-3 flex flex-col gap-1"
            >
              <div className="text-sm font-semibold text-blue-900">
                {meta.title}
              </div>
              <div className="text-xs text-gray-600">{meta.description}</div>
              <div className="mt-2 flex items-baseline gap-4">
                <div>
                  <div className="text-[0.65rem] uppercase tracking-wide text-gray-500">
                    Avg
                  </div>
                  <div className="text-xl font-bold text-blue-900">
                    {formatMinutes(metric.avg)}
                  </div>
                </div>
                <div>
                  <div className="text-[0.65rem] uppercase tracking-wide text-gray-500">
                    P90
                  </div>
                  <div className="text-xl font-bold text-blue-900">
                    {formatMinutes(metric.p90)}
                  </div>
                </div>
              </div>
              <div className="mt-1 text-[0.65rem] text-gray-600">
                P90 means 90% of {meta.title.toLowerCase()} is{' '}
                {formatMinutes(metric.p90, false)} min or faster.
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex-1 overflow-auto">
        <table className="min-w-full text-xs border rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-3 py-2 text-left font-semibold border-b">Unit</th>
              <th className="px-3 py-2 text-right font-semibold border-b">Calls</th>
              <th
                className="px-3 py-2 text-right font-semibold border-b cursor-pointer"
                onClick={() => handleSort('call_processing_p90')}
              >
                Call proc avg / P90 (min)
              </th>
              <th
                className="px-3 py-2 text-right font-semibold border-b cursor-pointer"
                onClick={() => handleSort('turnout_p90')}
              >
                Turnout avg / P90 (min)
              </th>
              <th
                className="px-3 py-2 text-right font-semibold border-b cursor-pointer"
                onClick={() => handleSort('travel_p90')}
              >
                Travel avg / P90 (min)
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row) => (
              <tr key={row.unit_id} className="odd:bg-white even:bg-gray-50">
                <td className="px-3 py-1.5 border-b text-sm font-medium text-gray-800">
                  {row.unit_id}
                </td>
                <td className="px-3 py-1.5 border-b text-right text-gray-700">
                  {row.calls}
                </td>
                <td className="px-3 py-1.5 border-b text-right text-gray-700">
                  {formatMinutes(row.call_processing_avg)} /{' '}
                  {formatMinutes(row.call_processing_p90)}
                </td>
                <td className="px-3 py-1.5 border-b text-right text-gray-700">
                  {formatMinutes(row.turnout_avg)} /{' '}
                  {formatMinutes(row.turnout_p90)}
                </td>
                <td className="px-3 py-1.5 border-b text-right text-gray-700">
                  {formatMinutes(row.travel_avg)} / {formatMinutes(row.travel_p90)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ResponseTimeBreakdown

