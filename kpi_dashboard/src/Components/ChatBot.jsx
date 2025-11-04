import React from 'react'

const ChatBot = () => {
  return (
    <div className='m2 mt-20 text-xs justify-center text-center shadow-blue-500/20 bg-white shadow-md rounded-2xl p-2 h-min-40 w-full'>
        ChatBot
        <div className='border m1 text-xs justify-center shadow-blue-500/20 bg-white shadow-md rounded-2xl p-2 w-full'>
            <p className='text-left'>Fammy: Hello! How can I assist you today?</p><br/>
            <p className='text-right'>User: I need help with my account.</p><br/>
            <p className='text-left'>Fammy: Sure! What seems to be the issue?</p><br/>
        </div>
    </div>
  )
}

export default ChatBot