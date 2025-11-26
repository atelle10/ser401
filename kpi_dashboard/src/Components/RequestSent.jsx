import React from 'react'
import { Link } from 'react-router-dom'
import loginLogo from './assets/login_logo.png'

const RequestSent = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-r to-blue-400 via-slate-300 from-red-400 p-4">
      <div className='absolute inset-0 bg-no-repeat bg-center opacity-70' style={{ backgroundImage: `url(${loginLogo})` }}></div>
      
      {/* Success Card - matching dashboard style - Mobile Responsive */}
      <div className="relative bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 w-full max-w-md text-center space-y-4 sm:space-y-6">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>

        {/* Title and Message */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">Request Sent Successfully</h1>
          <p className="text-gray-600">
            Thank you for registering! Your account request has been submitted and is pending approval. 
            Our team will review your information and notify you via email once your account is activated.
          </p>
        </div>

        {/* Expected Timeline */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Expected Response Time:</strong> 1-2 business days
          </p>
        </div>

        {/* Return Button */}
        <Link 
          to="/" 
          className="inline-block w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-lg"
        >
          Return to Login
        </Link>
      </div>
    </div>
  )
}

export default RequestSent