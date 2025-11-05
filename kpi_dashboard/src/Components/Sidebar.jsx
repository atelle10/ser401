import React from 'react'

const Sidebar = () => {
  return (
    <div className='m-1 text-xs justify-center text-left font-bold shadow-blue-500/20 bg-white size-fit shadow-md rounded-2xl p-2'>
        <div className="h-8 p-2 cursor-pointer rounded-full flex justify-left items-center hover:bg-blue-400 transition-all duration-500 ease-in-out hover:-translate-y-1 hover:scale-105 pointer-events-auto">
            <img src="/assets/dashboard_icon.png" alt="Dashboard Icon" className='inline w-6 h-6 mr-2'/>
            <p>Dashboard</p>
        </div>
        <div className="h-8 p-2 cursor-pointer rounded-full flex justify-left items-center hover:bg-blue-400 transition-all duration-500 ease-in-out hover:-translate-y-1 hover:scale-105 pointer-events-auto">
            <img src="/assets/white fire icon.png" alt="White Fire Icon" className='inline w-5 h-5 mr-2'/>
            <p>Fire Department</p>
        </div>
        <div className="h-8 p-2 cursor-pointer rounded-full flex justify-left items-center hover:bg-blue-400 transition-all duration-500 ease-in-out hover:-translate-y-1 hover:scale-105 pointer-events-auto">
            <img src="/assets/white medical icon.png" alt="Medical Icon" className='inline w-5 h-5 mr-2 center'/>
            <p>Medical (EMS)</p>
        </div>
        <div className="h-8 p-2 cursor-pointer rounded-full flex justify-left items-center hover:bg-blue-400 transition-all duration-500 ease-in-out hover:-translate-y-1 hover:scale-105 pointer-events-auto">
            <img src="/assets/account_icon.png" alt="Account Icon" className='inline w-5 h-5 mr-2'/>
            <p>Account</p>
        </div>
        <div className="h-8 p-2 cursor-pointer rounded-full flex justify-left items-center hover:bg-blue-400 transition-all duration-500 ease-in-out hover:-translate-y-1 hover:scale-105 pointer-events-auto">
            <img src="/assets/settings_icon.png" alt="Settings Icon" className='inline w-5 h-5 mr-2'/>
            <p>Settings</p>
        </div>
    </div>
  )
}

export default Sidebar