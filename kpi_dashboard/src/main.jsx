import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import Login from './Components/Login.jsx';
import Register from './Components/Register.jsx';

const root = createRoot(document.getElementById('root'));

root.render(
<StrictMode >
  <div>
    <Login />
  </div>
  </StrictMode>,
);


