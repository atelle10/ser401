import React from 'react'

const NavBar = ({ currentView, setCurrentView }) => {
  const getItemClass = (view) => {
    const baseClass = "h-8 p-1 sm:p-2 transition-all duration-500 ease-in-out hover:-translate-y-1 hover:scale-110 hover:text-white cursor-pointer rounded-full flex justify-center items-center my-1"
    return currentView === view
      ? `${baseClass} bg-blue-400 text-white`
      : `${baseClass} hover:bg-blue-400`
  }

  return (
    <div className='flex justify-center items-center gap-6 text-center font-bold h-10 shadow-blue-500/20 shadow-md rounded-2xl bg-white w-full'>
        <div 
          className={getItemClass('dashboard')}
          onClick={() => setCurrentView('dashboard')}
        >
            <img src="./src/Components/assets/home icon.png" alt="Home Icon" className='inline w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 mr-1 sm:mr-2'/>
            <p className="hidden sm:inline text-sm md:text-base">Home</p>
        </div>
        <div className="h-8 p-2 hover:bg-blue-400 transition-all duration-500 ease-in-out hover:-translate-y-1 hover:scale-110 hover:text-white cursor-pointer rounded-full flex justify-center items-center my-1">
            <img src="./src/Components/assets/fire icon.png" alt="Fire Icon" className='inline w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 mr-1 sm:mr-2'/>
            <p className="hidden sm:inline text-sm md:text-base">Fire</p>
        </div>
        <div className="h-8 p-2 hover:bg-blue-400 transition-all duration-500 ease-in-out hover:-translate-y-1 hover:scale-110 hover:text-white cursor-pointer rounded-full flex justify-center items-center my-1">
            <img src="./src/Components/assets/medical icon.png" alt="Medical Icon" className='inline w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 mr-1 sm:mr-2'/>
            <p className="hidden sm:inline text-sm md:text-base">Medical</p>
        </div>
        <div 
          className={getItemClass('upload')}
          onClick={() => setCurrentView('upload')}
        >
            <img src="./src/Components/assets/upload icon.png" alt="Upload Icon" className='inline w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 mr-1 sm:mr-2'/>
            <p className="hidden sm:inline text-sm md:text-base">Upload</p>
        </div>
    </div>
  )
}

export default NavBar