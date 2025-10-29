import React from 'react'

const Sidebar = () => {
  return (
    <div className='m-1 grid grid-cols-3 justify-center text-center font-bold text-blue-800 bg-red-200 size-fit shadow-red-500/40 shadow-lg rounded-2xl'>
        <div className="mt-15 h-8 col-span-3 p-2 cursor-pointer rounded-full flex justify-center items-center my-1">
            <p>Sidebar Item 1</p>
        </div>
        <div className="h-8 col-span-3 p-2 cursor-pointer rounded-full flex justify-center items-center my-1">
            <p>Sidebar Item 2</p>
        </div>
        <div className="h-8 col-span-3 p-2 cursor-pointer rounded-full flex justify-center items-center my-1">
            <p>Sidebar Item 3</p>
        </div>
        <div className="h-8 col-span-3 p-2 cursor-pointer rounded-full flex justify-center items-center my-1">
            <p>Sidebar Item 4</p>
        </div>
        <div className="h-8 mb-15 col-span-3 p-2 cursor-pointer rounded-full flex justify-center items-center my-1">
            <p>Sidebar Item 5</p>
        </div>
    </div>
  )
}

export default Sidebar