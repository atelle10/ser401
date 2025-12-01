import React from 'react';
import dashboardIcon from './assets/dashboard_icon.png';
import whiteFireIcon from './assets/white fire icon.png';
import whiteMedicalIcon from './assets/white medical icon.png';
import accountIcon from './assets/account_icon.png';
import settingsIcon from './assets/settings_icon.png';

const Sidebar = ({ currentView, setCurrentView, onAccountClick, role }) => {
  const getItemClass = (view) => {
    const baseClass = "h-8 p-2 cursor-pointer rounded-full flex justify-left items-center transition-all duration-500 ease-in-out hover:-translate-y-1 hover:scale-105 pointer-events-auto";
    return currentView === view
      ? `${baseClass} bg-blue-400 text-white`
      : `${baseClass} hover:bg-white hover:text-blue-800`;
  };

  const handleAccountClick = () => {
    if (onAccountClick) {
      onAccountClick();
    } else if (setCurrentView) {
      setCurrentView('account');
    }
  };

  return (
    <div className='w-fit lg:w-full text-xs text-white justify-center text-left font-bold shadow-blue-500/30 shadow-md rounded-2xl bg-blue-500/40 p-2'>
      <div className='flex lg:flex-col gap-2 lg:gap-4 overflow-x-auto lg:overflow-x-visible'>
        <div className={getItemClass('dashboard')} onClick={() => setCurrentView('dashboard')}>
          <img src={dashboardIcon} alt="Dashboard Icon" className='inline w-5 h-5 lg:w-6 lg:h-6 lg:mr-2' />
          <p className="hidden lg:inline whitespace-nowrap">Dashboard</p>
        </div>

        <div className="h-8 p-2 cursor-pointer rounded-full flex justify-left items-center hover:bg-white hover:text-blue-800 transition-all duration-500 ease-in-out hover:-translate-y-1 hover:scale-105 pointer-events-auto">
          <img src={whiteFireIcon} alt="Fire Icon" className='inline w-5 h-5 lg:w-6 lg:h-6 lg:mr-2' />
          <p className="hidden lg:inline whitespace-nowrap">Fire Department</p>
        </div>

        <div className="h-8 p-2 cursor-pointer rounded-full flex justify-left items-center hover:bg-white hover:text-blue-800 transition-all duration-500 ease-in-out hover:-translate-y-1 hover:scale-105 pointer-events-auto">
          <img src={whiteMedicalIcon} alt="Medical Icon" className='inline w-5 h-5 lg:w-6 lg:h-6 lg:mr-2' />
          <p className="hidden lg:inline whitespace-nowrap">Medical (EMS)</p>
        </div>

        <div className={getItemClass('account')} onClick={handleAccountClick}>
          <img src={accountIcon} alt="Account Icon" className='inline w-5 h-5 lg:w-6 lg:h-6 lg:mr-2' />
          <p className="hidden lg:inline whitespace-nowrap">Account</p>
        </div>

        {/* Settings - admin only */}
        {role === 'admin' && (
          <div className={getItemClass('settings')} onClick={() => setCurrentView('settings')}>
            <img src={settingsIcon} alt="Settings Icon" className='inline w-5 h-5 lg:w-6 lg:h-6 lg:mr-2' />
            <p className="hidden lg:inline whitespace-nowrap">Settings</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;