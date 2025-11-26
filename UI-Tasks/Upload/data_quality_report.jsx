import React from 'react'

export default function DataQualityReport({ summary, rows }) {
  return (
    <div className="border rounded-xl">
      <div className="p-3 border-b">
        <h3 className="font-semibold">Validation Summary</h3>
        <div className="text-sm text-gray-700">
          <span className="mr-4">OK: {summary.ok}</span>
          <span className="mr-4">Errors: {summary.errors}</span>
          <span>Warnings: {summary.warnings}</span>
        </div>
      </div>
      <div className="p-3">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-1 pr-2">Row</th>
              <th className="py-1 pr-2">Field</th>
              <th className="py-1">Message</th>
            </tr>
          </thead>
          <tbody>
            {(rows || []).slice(0, 50).map((r, i) => (
              <tr key={i} className="border-b last:border-0">
                <td className="py-1 pr-2">{r.row}</td>
                <td className="py-1 pr-2">{r.field}</td>
                <td className="py-1">{r.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
