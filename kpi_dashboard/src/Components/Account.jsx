import React from 'react';

const Account = ({ onBack }) => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-xl border">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Account Details</h1>
          {onBack && (
            <button
              onClick={onBack}
              className="text-sm px-3 py-1 rounded-full border hover:bg-gray-100"
            >
              Back to Dashboard
            </button>
          )}
        </div>

        <div className="flex flex-col items-center mb-6">
          <img
            src="./src/Components/assets/account.png"
            alt="Profile"
            className="w-20 h-20 rounded-full shadow mb-3"
          />
          <h2 className="text-lg font-medium">John Doe</h2>
          <p className="text-gray-600 text-sm">john.doe@example.com</p>
        </div>

        <div className="space-y-4 w-full">
          <div>
            <h3 className="text-xs font-bold text-gray-600 uppercase">Name</h3>
            <p className="border p-2 rounded-md mt-1 text-sm">John Doe</p>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-600 uppercase">Email</h3>
            <p className="border p-2 rounded-md mt-1 text-sm">
              john.doe@example.com
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-600 uppercase">Role</h3>
            <p className="border p-2 rounded-md mt-1 text-sm">
              Administrator
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
