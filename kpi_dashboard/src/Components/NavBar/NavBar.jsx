import React from 'react'

const NavBar = () => {
  return (
    <div className='grid grid-cols-8 justify-center text-center font-bold text-blue-800 border border-black bg-orange-200 h-10'>
        <div className="h-8 col-span-1 p-2 cursor-pointer rounded-full flex justify-center items-center my-1">
            <img src="./src/assets/Famar Logo.png" alt="Famar Logo" className='inline- w-7 h-7 mr-2'/>
            <p className='text-xs text-style: italic'>Fire And Medical Analytic Report</p>
        </div>
        <div className="col-span-1 p-8"></div>
        <div className="h-8 col-span-1 p-2 hover:bg-orange-500 hover:text-white cursor-pointer rounded-full flex justify-center items-center my-1">
            <img src="./src/assets/home icon.png" alt="Home Icon" className='inline- w-7 h-7 mr-2'/>
            <p>Home</p>
        </div>
        <div className="h-8 col-span-1 p-2 hover:bg-orange-500 hover:text-white cursor-pointer rounded-full flex justify-center items-center my-1">
            <img src="./src/assets/fire icon.png" alt="Fire Icon" className='inline- w-7 h-7 mr-2'/>
            <p>Fire</p>
        </div>
        <div className="h-8 col-span-1 p-2 hover:bg-orange-500 hover:text-white cursor-pointer rounded-full flex justify-center items-center my-1">
            <img src="./src/assets/medical icon.png " alt="Medical Icon" className='inline- w-7 h-7 mr-2'/>
            <p>Medical</p>
        </div>
        <div className="h-8 col-span-1 p-2 hover:bg-orange-500 hover:text-white cursor-pointer rounded-full flex justify-center items-center my-1">
            <img src="./src/assets/upload icon.png" alt="Upload Icon" className='inline- w-7 h-7 mr-2'/>
            <p>Upload</p>
        </div>
        <div className="col-span-1 p-8"></div>
        <div className="h-8 col-span-1 p-2 hover:bg-orange-500 hover:text-white cursor-pointer rounded-full flex justify-center items-center my-1">
            <img src="./src/assets/account.png" alt="Account Icon" className='inline- w-7 h-7 mr-2'/>
            <span>John Doe</span>
        </div>
    </div>
  )
}

export default NavBar