import React, { useState, useRef, useEffect } from 'react'
import { sendChatMessage } from '../services/chatService'

const ChatBot = ({ context }) => {
  // State for messages, input, and loading
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am Fammy. Ask me about the dashboard data.' }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  // Ref for auto-scrolling to bottom of messages
  const messagesEndRef = useRef(null)
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Handle input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  }
  
  // Clear chat history
  const handleClearChat = () => {
    setMessages([{ role: 'assistant', content: 'Hello! I am Fammy. Ask me about the dashboard data.' }])
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Don't submit if empty or loading
    if (!inputValue.trim() || isLoading) return

    const userMessage = inputValue.trim()

    // Clear input and show user message
    setInputValue('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    // Use default context if not provided
    const chatContext = context || {
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date().toISOString(),
      region: 'all'
    }

    // Call API
    const result = await sendChatMessage(userMessage, chatContext)

    if (result.success) {
      setMessages(prev => [...prev, { role: 'assistant', content: result.data.answer }])
    } else {
      setMessages(prev => [...prev, { role: 'assistant', content: `Sorry: ${result.error}` }])
    }

    setIsLoading(false)
  }

  return (
    <div className='m-0 mt-0 text-sm font-bold justify-center text-center shadow-blue-500/20 bg-blue-500/40 text-white shadow-md rounded-2xl p-2 min-h-40 w-full'>
      <div className="mb-2 flex items-center justify-between px-2">
        <span>Fammy - Dashboard Assistant</span>
        <button
          onClick={handleClearChat}
          className='text-xs bg-blue-600 hover:bg-blue-700 px-2 py-0.5 rounded transition-colors'
          title='Clear chat history'
        >
          Clear
        </button>
      </div>

      {/* Messages container */}
      <div className='border m1 text-xs justify-center shadow-blue-500/20 bg-gray-200 shadow-md rounded-2xl p-2 w-full h-48 overflow-y-auto mb-2'>
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block rounded-lg p-2 max-w-[90%] ${
              msg.role === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-500 text-white'
            }`}>
              <span className='font-bold'>{msg.role === 'user' ? 'You: ' : 'Fammy: '}</span>
              {msg.content}
            </span>
          </div>
        ))}
        {isLoading && (
          <div className='text-left mb-2'>
            <span className='inline-block rounded-lg p-2 bg-gray-500 text-white'>
              <span className='font-bold'>Fammy: </span>
              <span className='animate-pulse'>Typing...</span>
            </span>
          </div>
        )}
        {/* Invisible element for auto-scroll */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className='flex gap-1'>
        <div className='flex-1 relative'>
          <input
            type='text'
            value={inputValue}
            onChange={handleInputChange}
            placeholder='Ask about incidents, response times...'
            className='w-full rounded-lg px-2 py-1 pr-12 text-sm text-gray-800 border border-gray-300 focus:outline-none focus:border-blue-500'
            disabled={isLoading}
            maxLength={500}
          />
          {/* Character counter */}
          <span className={`absolute right-2 top-1/2 -translate-y-1/2 text-[10px] ${
            inputValue.length > 450 ? 'text-red-500' : 'text-gray-400'
          }`}>
            {inputValue.length}/500
          </span>
        </div>
        <button
          type='submit'
          disabled={isLoading || !inputValue.trim()}
          className='bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg px-3 py-1 text-xs font-medium transition-colors'
        >
          {isLoading ? '...' : 'Send'}
        </button>
      </form>
    </div>
  )
}

export default ChatBot