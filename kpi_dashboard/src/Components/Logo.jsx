import React from 'react'

const Logo = () => {
  return (
<<<<<<< HEAD
    <div className="grid grid-cols-1 p-1.5 text-xs items-center cursor-pointer shrink rounded-2xl justify-center text-white bg-blue-500/40 shadow-blue-500/20 shadow-md w-fit h-fit">
        <img src={famarLogo} alt="Famar Logo" className='mx-auto object-center w-13 h-13 transition-all duration-500 ease-in-out hover:-translate-y-1 hover:scale-110'/>
=======
    <div className="grid grid-cols-1 p-1.5 text-xs items-center cursor-pointer shrink rounded-2xl justify-center bg-white shadow-blue-500/20 shadow-md w-fit h-fit">
        <img src="./src/Components/assets/famar_logo.png" alt="Famar Logo" className='mx-auto object-center w-13 h-13 transition-all duration-500 ease-in-out hover:-translate-y-1 hover:scale-110'/>
>>>>>>> 41fbf86 (feat(task-504): cherry-pick real Microsoft Entra ID SSO implementation with MSAL and backend validationfeat(task-504): implement real Microsoft Entra ID SSO with MSAL and backend token validation; cleanup duplicates; update README)
        <h1 className="text-center text-xs font-bold text-wrap">Fire And Medical <br /> Analytic Report</h1>
    </div>
  )
}

export default Logo