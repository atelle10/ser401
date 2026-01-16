import React from 'react';

const User = ({ handleLogout }) => {
  return (
    <div 
      onClick={handleLogout}
      className="h-10 p-2 bg-white hover:bg-red-400 hover:text-white cursor-pointer rounded-full flex flex-row items-center justify-center transition-all duration-500 ease-in-out hover:-translate-y-1 hover:scale-110 shrink mb-2 shadow-blue-500/20 shadow-md w-fit"
    >
      <img src="./src/Components/assets/account.png" alt="Account Icon" className="inline w-7 h-7 mr-2" />
      <span className="mr-4">John Doe</span>  {/* Your name */}
      <span className="text-sm font-bold">Logout</span>  {/* ← logout text */}
    </div>
  );
};

export default User;
