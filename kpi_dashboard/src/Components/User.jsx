import React from 'react'

const User = () => {
  return (
    <div className="h-10 p-2 bg-white hover:bg-red-400 hover:text-white cursor-pointer rounded-full flex flex-row items-center justify-center transition-all duration-500 ease-in-out hover:-translate-y-1 hover:scale-110 shrink shadow-blue-500/20 shadow-md w-fit">
            <img src="./src/Components/assets/account.png" alt="Account Icon" className='inline w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 sm:mr-2'/>
            <span className="hidden md:inline text-sm">John Doe</span>
    </div>
  )
}

export default User