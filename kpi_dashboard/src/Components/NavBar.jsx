import React from 'react'

const NavBar = ({ currentView, setCurrentView }) => {
  const getItemClass = (view) => {
    const baseClass = "h-8 col-span-1 p-2 transition-all duration-500 ease-in-out hover:-translate-y-1 hover:scale-110 hover:text-white cursor-pointer rounded-full flex justify-center items-center my-1"
    return currentView === view
      ? `${baseClass} bg-blue-400 text-white`
      : `${baseClass} hover:bg-blue-400`
  }

  return (
    <div className='flex justify-center text-center font-bold h-10 shadow-blue-500/20 shadow-md rounded-2xl bg-white w-full'>
        <div 
          className={getItemClass('dashboard')}
          onClick={() => setCurrentView('dashboard')}
        >
            <img src="./src/Components/assets/home icon.png" alt="Home Icon" className='inline w-7 h-7 mr-2'/>
            <p>Home</p>
        </div>
        <div className="h-8 col-span-1 p-2 hover:bg-blue-400 transition-all duration-500 ease-in-out hover:-translate-y-1 hover:scale-110 hover:text-white cursor-pointer rounded-full flex justify-center items-center my-1">
            <img src="./src/Components/assets/fire icon.png" alt="Fire Icon" className='inline w-7 h-7 mr-2'/>
            <p>Fire</p>
        </div>
        <div className="h-8 col-span-1 p-2 hover:bg-blue-400 transition-all duration-500 ease-in-out hover:-translate-y-1 hover:scale-110 hover:text-white cursor-pointer rounded-full flex justify-center items-center my-1">
            <img src="./src/Components/assets/medical icon.png" alt="Medical Icon" className='inline w-7 h-7 mr-2'/>
            <p>Medical</p>
        </div>
        <div 
          className={getItemClass('upload')}
          onClick={() => setCurrentView('upload')}
        >
            <img src="./src/Components/assets/upload icon.png" alt="Upload Icon" className='inline w-7 h-7 mr-2'/>
            <p>Upload</p>
        </div>
    </div>
  )
}

export default NavBar