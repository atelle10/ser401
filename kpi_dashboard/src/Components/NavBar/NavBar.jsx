import React from 'react'

const NavBar = () => {
  return (
    <div className='grid grid-cols-8 text-center text-blue-800 border border-black bg-gray-200'>
        <div className="flex justify-center items-center col-span-1 flex-col p-2 hover:bg-blue-800 hover:text-white cursor-pointer">
            <img src="./src/assets/Famar Logo.png" alt="Famar Logo" className='inline-block w-8 h-8 mr-2'/>
            Fire And Medical Analytic Report
        </div>
        <div className="col-span-1 p-8"></div>
        <div className="col-span-1 p-2 hover:bg-blue-800 hover:text-white cursor-pointer">Home</div>
        <div className="col-span-1 p-2 hover:bg-blue-800 hover:text-white cursor-pointer">Fire</div>
        <div className="col-span-1 p-2 hover:bg-blue-800 hover:text-white cursor-pointer">Medical</div>
        <div className="col-span-1 p-2 hover:bg-blue-800 hover:text-white cursor-pointer">Upload</div>
        <div className="col-span-1 p-8"></div>
        <div className="col-span-1 p-2 hover:bg-blue-800 hover:text-white cursor-pointer">
            <img src = "./src/assets/account.png" alt="User Icon" className='inline-block w-8 h-8 mr-2'/>
            Account</div>
    </div>
  )
}

export default NavBar