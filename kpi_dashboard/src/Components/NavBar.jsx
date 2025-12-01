import React from 'react'
<<<<<<< HEAD
import homeIcon from './assets/home icon.png'
import fireIcon from './assets/fire icon.png'
import medicalIcon from './assets/medical icon.png'
import uploadIcon from './assets/upload icon.png'

const NavBar = ({ currentView, setCurrentView }) => {
  const getItemClass = (view) => {
    const baseClass = "h-8 p-1 sm:p-2 hover:bg-white transition-all duration-500 ease-in-out hover:-translate-y-1 hover:scale-110 hover:text-blue-800 cursor-pointer rounded-full flex justify-center items-center my-1"
    return currentView === view
      ? `${baseClass} text-white`
      : `${baseClass} hover:bg-white`
  }
=======
import FileDropZone from './FileDropZone'
import Popup from 'reactjs-popup';
>>>>>>> 41fbf86 (feat(task-504): cherry-pick real Microsoft Entra ID SSO implementation with MSAL and backend validationfeat(task-504): implement real Microsoft Entra ID SSO with MSAL and backend token validation; cleanup duplicates; update README)

const NavBar = () => {
  return (
<<<<<<< HEAD
    <div className='text-white flex justify-center items-center gap-6 text-center font-bold h-10 shadow-blue-500/30 shadow-md rounded-2xl bg-blue-500/40 w-full'>
        <div 
          className={getItemClass('dashboard')}
          onClick={() => setCurrentView('dashboard')}
        >
            <img src={homeIcon} alt="Home Icon" className='inline w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 mr-1 sm:mr-2'/>
            <p className="hidden sm:inline text-sm md:text-base">Home</p>
        </div>
        <div className="h-8 p-2 text-white hover:bg-white transition-all duration-500 ease-in-out hover:-translate-y-1 hover:scale-110 hover:text-blue-800 cursor-pointer rounded-full flex justify-center items-center my-1">
            <img src={fireIcon} alt="Fire Icon" className='inline w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 mr-1 sm:mr-2'/>
            <p className="hidden sm:inline text-sm md:text-base">Fire</p>
        </div>
        <div className="h-8 p-2 text-white hover:bg-white transition-all duration-500 ease-in-out hover:-translate-y-1 hover:scale-110 hover:text-blue-800 cursor-pointer rounded-full flex justify-center items-center my-1">
            <img src={medicalIcon} alt="Medical Icon" className='inline w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 mr-1 sm:mr-2'/>
            <p className="hidden sm:inline text-sm md:text-base">Medical</p>
=======
    <div className='flex justify-center text-center font-bold h-10 shadow-blue-500/20 shadow-md rounded-2xl bg-white w-full'>
        <div className="h-8 col-span-1 p-2 hover:bg-blue-400 transition-all duration-500 ease-in-out hover:-translate-y-1 hover:scale-110 hover:text-white cursor-pointer rounded-full flex justify-center items-center my-1">
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
>>>>>>> 41fbf86 (feat(task-504): cherry-pick real Microsoft Entra ID SSO implementation with MSAL and backend validationfeat(task-504): implement real Microsoft Entra ID SSO with MSAL and backend token validation; cleanup duplicates; update README)
        </div>
        <div className="h-8 col-span-1 p-2 hover:bg-blue-400 transition-all duration-500 ease-in-out hover:-translate-y-1 hover:scale-110 hover:text-white cursor-pointer rounded-full flex justify-center items-center my-1">
             <Popup trigger=
                {<button className='cursor-pointer justify-center'><img src="./src/Components/assets/upload icon.png" alt="Upload Icon" className='inline w-7 h-7'/>
                Upload</button>}
                position="bottom center"
                closeOnDocumentClick>
                <div>
                    <FileDropZone />
                </div>
            </Popup>
        </div>
    </div>
  )
}

export default NavBar