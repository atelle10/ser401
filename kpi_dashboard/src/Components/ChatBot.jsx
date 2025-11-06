import React from 'react'

const ChatBot = () => {
  return (
    <div className='m-0 mt-0 -translate-y-3 transform text-xs justify-center text-center shadow-blue-500/20 bg-white shadow-md rounded-2xl p-2 h-min-40 w-full'>
        ChatBot
        <div className='border m1 text-xs justify-center shadow-blue-500/20 bg-gray-200 shadow-md rounded-2xl p-2 w-full'>
            <p className='text-left bg-gray-500 rounded-lg w-fit p-0.5 text-white'><span className=' font-bold'>Fammy: </span> Hello! How can I assist you today?</p><br/>
            <p className='text-right bg-blue-500 rounded-lg p-0.5 text-white'><span className=' font-bold'>User: </span> I need help with my account.</p><br/>
            <p className='text-left bg-gray-500 rounded-lg w-fit p-0.5 text-white'><span className='font-bold'>Fammy: </span>Sure! What seems to be the issue?</p><br/>
        </div>
    </div>
  )
}

export default ChatBot