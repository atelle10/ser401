import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import NavBar from './Components/NavBar/NavBar.jsx'
import Sidebar from './Components/Sidebar/Sidebar.jsx'

createRoot(document.getElementById('root')).render(
    <nav className="m-1.5 p-2 bg-gray-200 rounded-2xl shadow-lg flex flex-row flex-wrap gap-1">
    <StrictMode >
        <div className="basis-1/8 shrink mb-2 rounded grid grid-cols-1 justify-center p-1 bg-red-200 shadow-red-500/40 shadow-md w-fit h-fit">
          <img src="./src/Components/NavBar/assets/Famar Logo.png" alt="Famar Logo" className='inline- w-20 h-20 object-center'/>
          <h1 className="text-center text-xs font-bold text-blue-800">Fire And Medical <br /> Analytic Report</h1>
        </div>
      < NavBar className="basis-6/8 grow shrink mb-2 items-center justify-center"/>
      <div className="basis-1/8 h-8 col-span-1 p-2 bg-red-400 hover:bg-red-500 hover:text-white cursor-pointer rounded-full flex justify-center items-center my-1">
            <img src="./src/Components/NavBar/assets/account.png" alt="Account Icon" className='inline- w-7 h-7 mr-2'/>
            <span>John Doe</span>
        </div>
      <Sidebar />
    </StrictMode>,
    </nav>
)
