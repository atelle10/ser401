import React from 'react';
import { createRoot } from 'react-dom/client';
import './main.css';
import Login from './Components/Login.jsx';
import Dashboard from './Components/Dashboard/Dashboard.jsx';

const App = () => {
  const token = localStorage.getItem('token');
  return token ? <Dashboard /> : <Login />;
};

createRoot(document.getElementById('root')).render(<App />);
