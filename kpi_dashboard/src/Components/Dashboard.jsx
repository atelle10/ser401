import React from 'react'
import KPI_1 from './Dashboard/KPIs/KPI_1'
import KPI_2 from './Dashboard/KPIs/KPI_2'
import KPI_3 from './Dashboard/KPIs/KPI_3'
import KPI_4 from './Dashboard/KPIs/KPI_4'
import Chart from './Dashboard/Chart'

const Dashboard = () => {
  return (
    <div className="grid grid-cols-4 gap-4 p-4">
        <KPI_1 />
        <KPI_2 />
        <KPI_3 />
        <KPI_4 />
        <Chart />
    </div>
  )
}

export default Dashboard