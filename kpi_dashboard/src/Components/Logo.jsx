import React from 'react'

const Logo = () => {
  return (
    <div className="grid grid-cols-1 text-xs items-center cursor-pointer shrink rounded-2xl justify-center p-1 object-center bg-white shadow-blue-500/20 shadow-md w-fit h-fit">
        <img src="./src/Components/assets/Famar Logo.png" alt="Famar Logo" className='object-center w-15 h-15 transition-all duration-500 ease-in-out hover:-translate-y-1 hover:scale-110'/>
        <h1 className="text-center text-xs font-bold text-wrap">Fire And Medical Analytic Report</h1>
    </div>
  )
}

export default Logo