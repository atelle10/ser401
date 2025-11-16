import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import Login from './Components/Login.jsx'
import { loggedInStatus } from './Components/Login.jsx'
import Home from './Components/Home.jsx'

const root = createRoot(document.getElementById('root'));

function LoginPage() {
  useEffect(() => {
    console.log('Logged In Status:', loggedInStatus);
  }, [loggedInStatus]),

  root.render(
  <StrictMode >
    <div>
      {loggedInStatus === true ? <Home /> : () =>(<Login />, LoginPage())}
    </div>
    </StrictMode>,
  );
}

LoginPage();


