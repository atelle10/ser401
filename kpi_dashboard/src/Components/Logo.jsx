import React from 'react';
import famarLogo from './assets/famar_logo.png';

const Logo = () => {
  return (
    <div className="grid grid-cols-1 p-1.5 text-xs items-center cursor-pointer shrink rounded-2xl justify-center bg-white shadow-blue-500/20 shadow-md w-fit h-fit">
      <img src={famarLogo} alt="Famar Logo" className='mx-auto object-center w-13 h-13 transition-all duration-500 ease-in-out hover:-translate-y-1 hover:scale-110'/>
      <h1 className="text-center text-xs font-bold text-wrap">Fire And Medical <br /> Analytic Report</h1>
    </div>
  );
};

export default Logo;