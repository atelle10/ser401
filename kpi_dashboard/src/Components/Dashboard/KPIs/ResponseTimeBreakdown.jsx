import React, { useEffect, useMemo, useState } from 'react'

const PAGE_SIZE = 10

const formatMinutes = (value, suffix = true) => {
  if (value == null || Number.isNaN(value)) return '—'
  const num = value.toFixed(1)
  return suffix ? `${num} min` : num
}

const METRIC_LABELS = {
  call_processing: {
    title: 'Call processing time',
    description: 'From call received (PSAP) to dispatch',
    tooltip: 'Time from 911 call received (PSAP) to dispatch. P90 means 90% of calls were dispatched this fast or faster.',
  },
  turnout: {
    title: 'Turnout time',
    description: 'From dispatch to leaving the station (en route)',
    tooltip: 'Time from dispatch to when the unit goes en route. P90 means 90% of turnouts were this fast or faster.',
  },
  travel: {
    title: 'Travel time',
    description: 'From leaving the station (en route) to arrival on scene',
    tooltip: 'Time from en route to arrival on scene. P90 means 90% of travel times were this fast or faster.',
  },
}

const ResponseTimeBreakdown = ({ overall, perUnit }) => {
  const [sortConfig, setSortConfig] = useState({
    key: 'travel_p90',
    direction: 'desc',
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [cardTooltip, setCardTooltip] = useState(null)

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

  useEffect(() => {
    setCurrentPage(1)
  }, [perUnit, sortConfig])

  const totalPages = Math.ceil(sortedRows.length / PAGE_SIZE) || 0
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const paginatedRows = sortedRows.slice(startIndex, startIndex + PAGE_SIZE)
  const rangeEnd = sortedRows.length === 0 ? 0 : Math.min(startIndex + PAGE_SIZE, sortedRows.length)

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
          No data for this time window and region. Try a different date range or region.
        </p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg p-4 bg-white h-full flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-semibold mb-1">Response Time Breakdown</h3>
        <p className="text-xs text-gray-500">
          Times are in minutes. P90 means 90% of trips are this fast or faster.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {Object.entries(METRIC_LABELS).map(([key, meta]) => {
          const metric = overall?.[key] || {}
          const showTooltip = cardTooltip === key
          return (
            <div
              key={key}
              className="rounded-lg bg-blue-500/10 border border-blue-200 p-3 flex flex-col gap-1 relative"
              onMouseEnter={() => setCardTooltip(key)}
              onMouseLeave={() => setCardTooltip(null)}
            >
              <div className="text-sm font-semibold text-blue-900 flex items-center gap-1">
                {meta.title}
                <span
                  className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-200 text-blue-800 text-xs font-bold cursor-help"
                  aria-label="Definition"
                >
                  i
                </span>
              </div>
              {showTooltip && (
                <div className="absolute left-2 right-2 top-full mt-1 z-10 px-2 py-1.5 bg-gray-800 text-white text-xs rounded shadow-lg">
                  {meta.tooltip}
                </div>
              )}
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

      <div className="text-xs text-gray-500 space-y-0.5">
        <p>Per unit (Scottsdale units only): each row is one unit; P90 is the time 90% of that unit&apos;s trips met or beat.</p>
        <p>Click a column header to reorder the rows by that column: <strong>▼</strong> = slowest at top, <strong>▲</strong> = fastest at top. Click again to flip.</p>
        <p>Rows with non-positive or out-of-order timestamps are excluded from response-time KPI calculations.</p>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="min-w-full text-xs border rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-3 py-2 text-left font-semibold border-b">Unit</th>
              <th className="px-3 py-2 text-right font-semibold border-b">Calls</th>
              <th
                className="px-3 py-2 text-right font-semibold border-b cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort('call_processing_p90')}
                title="Reorder rows by this column. ▼ = slowest at top; ▲ = fastest at top. Click again to flip."
              >
                Call proc avg / P90 (min){sortConfig.key === 'call_processing_p90' ? (sortConfig.direction === 'desc' ? ' ▼' : ' ▲') : ''}
              </th>
              <th
                className="px-3 py-2 text-right font-semibold border-b cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort('turnout_p90')}
                title="Reorder rows by this column. ▼ = slowest at top; ▲ = fastest at top. Click again to flip."
              >
                Turnout avg / P90 (min){sortConfig.key === 'turnout_p90' ? (sortConfig.direction === 'desc' ? ' ▼' : ' ▲') : ''}
              </th>
              <th
                className="px-3 py-2 text-right font-semibold border-b cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort('travel_p90')}
                title="Reorder rows by this column. ▼ = slowest at top; ▲ = fastest at top. Click again to flip."
              >
                Travel avg / P90 (min){sortConfig.key === 'travel_p90' ? (sortConfig.direction === 'desc' ? ' ▼' : ' ▲') : ''}
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedRows.map((row) => (
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

      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded border border-gray-300 bg-white text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:bg-gray-50 transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
            {' · '}
            Showing {sortedRows.length === 0 ? 0 : startIndex + 1}–{rangeEnd} of {sortedRows.length}
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded border border-gray-300 bg-white text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:bg-gray-50 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default ResponseTimeBreakdown

