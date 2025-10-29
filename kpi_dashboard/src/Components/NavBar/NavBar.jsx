import React from 'react'

const NavBar = () => {
  return (
    <div className='grid grid-cols-6 justify-center text-center font-bold text-blue-800 bg-red-200 h-10 shadow-red-500/40 shadow-lg rounded-2xl'>
        <div className="col-span-1 p-8"></div>
        <div className="h-8 col-span-1 p-2 hover:bg-red-500 hover:text-white cursor-pointer rounded-full flex justify-center items-center my-1">
            <img src="./src/Components/NavBar/assets//home icon.png" alt="Home Icon" className='inline- w-7 h-7 mr-2'/>
            <p>Home</p>
        </div>
        <div className="h-8 col-span-1 p-2 hover:bg-red-500 hover:text-white cursor-pointer rounded-full flex justify-center items-center my-1">
            <img src="./src/Components/NavBar/assets/fire icon.png" alt="Fire Icon" className='inline- w-7 h-7 mr-2'/>
            <p>Fire</p>
        </div>
        <div className="h-8 col-span-1 p-2 hover:bg-red-500 hover:text-white cursor-pointer rounded-full flex justify-center items-center my-1">
            <img src="./src/Components/NavBar/assets/medical icon.png " alt="Medical Icon" className='inline- w-7 h-7 mr-2'/>
            <p>Medical</p>
        </div>
        <div className="h-8 col-span-1 p-2 hover:bg-red-500 hover:text-white cursor-pointer rounded-full flex justify-center items-center my-1">
            <img src="./src/Components/NavBar/assets/upload icon.png" alt="Upload Icon" className='inline- w-7 h-7 mr-2'/>
            <p>Upload</p>
        </div>
    </div>
  )
}

export default NavBar