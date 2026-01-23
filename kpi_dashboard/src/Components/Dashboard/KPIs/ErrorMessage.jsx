import React from 'react'

const ErrorMessage = ({ message, onRetry, color = 'red' }) => {
  const colorClasses = {
    red: 'bg-red-50 text-red-600 border-red-200',
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200'
  };

  return (
    <div className={`p-3 rounded-lg border ${colorClasses[color]} flex flex-col items-center gap-2`}>
      <span className="text-sm font-medium">{message || 'Error loading data'}</span>
      {onRetry && (
        <button onClick={onRetry} className="text-xs underline">
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
