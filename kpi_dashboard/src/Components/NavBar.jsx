import React from 'react';
import homeIcon from './assets/home icon.png';
import fireIcon from './assets/fire icon.png';
import medicalIcon from './assets/medical icon.png';
import uploadIcon from './assets/upload icon.png';
import Popup from 'reactjs-popup';
import FileDropZone from './FileDropZone';

const NavBar = ({ role }) => {
  const canUpload = role === 'admin' || role === 'analyst';

  return (
    <div className="flex justify-center items-center gap-6 text-center font-bold h-10 shadow-blue-500/20 shadow-md rounded-2xl bg-white w-full">
      
      {/* Home */}
      <div className="h-8 p-1 sm:p-2 transition-all duration-500 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-blue-400 hover:text-white cursor-pointer rounded-full flex justify-center items-center my-1">
        <img src={homeIcon} alt="Home" className="inline w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 mr-1 sm:mr-2" />
        <p className="hidden sm:inline text-sm md:text-base">Home</p>
      </div>

      {/* Fire */}
      <div className="h-8 p-1 sm:p-2 transition-all duration-500 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-blue-400 hover:text-white cursor-pointer rounded-full flex justify-center items-center my-1">
        <img src={fireIcon} alt="Fire" className="inline w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 mr-1 sm:mr-2" />
        <p className="hidden sm:inline text-sm md:text-base">Fire</p>
      </div>

      {/* Medical */}
      <div className="h-8 p-1 sm:p-2 transition-all duration-500 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-blue-400 hover:text-white cursor-pointer rounded-full flex justify-center items-center my-1">
        <img src={medicalIcon} alt="Medical" className="inline w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 mr-1 sm:mr-2" />
        <p className="hidden sm:inline text-sm md:text-base">Medical</p>
      </div>

      {/* Upload — analyst/admin only */}
      {canUpload && (
        <Popup
          trigger={
            <div className="h-8 p-1 sm:p-2 transition-all duration-500 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-blue-400 hover:text-white cursor-pointer rounded-full flex justify-center items-center my-1">
              <img src={uploadIcon} alt="Upload" className="inline w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 mr-1 sm:mr-2" />
              <p className="hidden sm:inline text-sm md:text-base">Upload</p>
            </div>
          }
          position="bottom center"
          closeOnDocumentClick
          arrow={false}
        >
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <FileDropZone />
          </div>
        </Popup>
      )}
    </div>
  );
};

export default NavBar;
