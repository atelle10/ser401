import React from 'react'

const User = () => {
  return (
    <div className="h-10 p-2 bg-white hover:bg-blue-400 hover:text-white cursor-pointer rounded-full flex flex-row items-center justify-center transition-all duration-500 ease-in-out hover:-translate-y-1 hover:scale-110 shrink mb-2 shadow-blue-500/20 shadow-md w-fit">
            <img src="/assets/account.png" alt="Account Icon" className='inline- w-7 h-7 mr-2'/>
            <span>John Doe</span>
    </div>
  )
}

export default User