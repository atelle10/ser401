import React, { useState } from 'react'

export default function AdminShell() {
  const [role] = useState('admin') // stub
  if (role !== 'admin') return null

  return (
    <div className="p-4 border rounded-xl">
      <h2 className="font-semibold mb-2">Admin Settings</h2>
      <ul className="list-disc pl-5 text-sm">
        <li>KPI Targets</li>
        <li>Data Dictionary</li>
        <li>Station Groups</li>
        <li>Rotating Dashboard</li>
        <li>Access Control</li>
      </ul>
    </div>
  )
}
