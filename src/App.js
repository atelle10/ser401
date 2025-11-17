import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SSO_CONFIG = {
  redirectUri: 'http://localhost:3000/auth/callback',
};

const SsoLogin = () => {
  const handleLogin = () => {
    toast.info('Redirecting to Microsoft SSO... (T1 Mock) Manually change URL to /auth/callback?code=mockcode to simulate Graph callback.', { autoClose: 5000 });
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#007bff' }}>Scottdale Fire Dashboard Login (T1 SSO)</h1>
      <p style={{ color: '#6c757d' }}><em>Precondition: Auth via SSO (#385 pg1)</em></p>
      <button 
        onClick={handleLogin} 
        style={{ 
          fontSize: '18px', padding: '12px 24px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' 
        }}
      >
        Login with SSO (Microsoft Teams)
      </button>
    </div>
  );
};

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    if (code) {
      toast.info('Fetching token from FastAPI stub... (localhost:8000/auth/token)', { autoClose: 3000 });
      fetch('http://localhost:8000/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, redirect_uri: SSO_CONFIG.redirectUri }),
      })
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
          return res.json();
        })
        .then(data => {
          if (data.access_token) {
            localStorage.setItem('token', data.access_token);
            const decoded = jwtDecode(data.access_token);
            console.log('Token decoded:', decoded);
            toast.success(`Logged in as ${decoded.role.toUpperCase()}! (MFA: ${decoded.mfa_enabled ? 'Enabled' : 'Required'})`, { autoClose: 4000 });
            if (!decoded.mfa_enabled) toast.warn('MFA required - full impl in T7', { autoClose: 3000 });
            navigate('/dashboard');
          } else {meesing
            throw new Error('No token in response');
          }
        })
        .catch(err => {
          console.error('Fetch error:', err);
          toast.error(`Access Denied: ${err.message} (Check FastAPI stub on 8000)`, { autoClose: 5000 });
          navigate('/');
        });
    } else {
      toast.error('Access Denied - No code in callback URL', { autoClose: 4000 });
      navigate('/');
    }
  }, [location, navigate]);

  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ color: '#6c757d' }}>Processing SSO Callback... (T1 Mock)</h2>
      <p>Check console (F12 > Console/Network) for token details and fetch status.</p>
    </div>
  );
};

const DashboardPlaceholder = () => {
  const token = localStorage.getItem('token');
  const decoded = token ? jwtDecode(token) : null;
  const role = decoded ? decoded.role : 'unauthenticated';
  const logout = () => {
    localStorage.removeItem('token');
    toast.info('Logged out - Redirecting to login', { autoClose: 3000 });
    window.location.href = '/';
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#28a745' }}>KPI Dashboard Placeholder (Task #385)</h1>
      <p><strong>Logged in as: {role.toUpperCase()}</strong> (e.g., Analyst views dispatch/turnout KPIs)</p>
      <p><em>Main Scenario (#385 pg1): System renders KPIs with Recharts (line for avg dispatch time, bar for incidents).</em></p>
      <p>Stubbed Filters: Date range (recent 30-day window), station (all), incident type (checkbox) - Add in #385 scenario 3.</p>
      <p>Next: Interact with viz (hover tooltips, zoom for trends, pg1 scenario 6).</p>
      <button onClick={logout} style={{ background: '#dc3545', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        Logout
      </button>
    </div>
  );
};

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={4000} hideProgressBar={false} theme="light" />
      <Routes>
        <Route path="/" element={<SsoLogin />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/dashboard" element={<DashboardPlaceholder />} />
      </Routes>
    </Router>
  );meesing
}

export default App;
