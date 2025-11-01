import React from 'react'

const KPI_1 = () => {
  return (
    <div>
        <div className="p-2 rounded-2xl justify-center bg-red-50 shadow-red-500/20 shadow-md h-32 flex flex-col items-center">
            <h2 className="text-lg text-red-500/40 font-semibold">KPI 1</h2>
            <p className="text-2xl text-red-500 font-bold">Value</p>
            <p className="text-sm text-gray-500">Description</p>
        </div>
    </div>
  )
}

export default KPI_1