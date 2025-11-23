import React from 'react'
import { Link } from 'react-router-dom'
import Register from './Register.jsx';

const RequestSent = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-r to-blue-400 via-slate-300 from-red-400">
        <div className=" flex items-center justify-center absolute inset-0 max-w-lg w-full mx-auto bg-[url('./src/Components/assets/login_logo.png')] bg-no-repeat bg-center">
            <div className="shadow-xl w-full max-w-md rounded-lg border bg-white border-white flex flex-col items-center justify-center p-2 ">
                <h1 className='text-xl font-bold mb-4'>Account Request Sent</h1>
                <p className='mb-4 text-center'>Thank you for registering! Your account request has been sent successfully. Our team will review your information and get back to you shortly.</p>
                <Link to="/" className='px-4 py-2 rounded-lg border border-gray-400 bg-blue-500 text-white transition-all duration-500 ease-in-out hover:-translate-y-0.5 hover:scale-105'>Return to Login</Link>
            </div>
        </div>
    </div>
  )
}

export default RequestSent