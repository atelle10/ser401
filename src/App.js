import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SSO_CONFIG = {
  redirectUri: 'http://localhost:3000/auth/callback',
};

// ============================
// SSO LOGIN PAGE – FAMAR BRANDED
// ============================
const SsoLogin = () => {
  const handleLogin = () => {
    toast.info(
      'Redirecting to Microsoft SSO... (T1 Mock)\nManually use ?code=admincode / mockcode / viewercode',
      { autoClose: 10000, position: 'top-center', toastId: 'login-hint' }
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      fontFamily: "'Segoe UI', Arial, sans-serif",
    }}>
      <h1 style={{
        fontSize: '56px',
        fontWeight: '700',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: '16px',
        textShadow: '0 4px 16px rgba(0,0,0,0.7)',
        letterSpacing: '2px',
      }}>
        FAMAR Dashboard Login
      </h1>

      <h2 style={{
        fontSize: '34px',
        fontWeight: '600',
        color: '#a0d8ef',
        textAlign: 'center',
        marginBottom: '60px',
      }}>
        Fire and Medical Analytic Report
      </h2>

      <p style={{
        fontSize: '20px',
        color: '#b0c4de',
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: '16px 40px',
        borderRadius: '12px',
        marginBottom: '70px',
        maxWidth: '720px',
        textAlign: 'center',
      }}>
        <em>Precondition: Authenticate via Microsoft SSO</em>
      </p>

      <button
        onClick={handleLogin}
        style={{
          fontSize: '28px',
          fontWeight: '600',
          padding: '24px 64px',
          background: '#0078d4',
          color: 'white',
          border: 'none',
          borderRadius: '16px',
          cursor: 'pointer',
          boxShadow: '0 14px 40px rgba(0,120,212,0.6)',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
        }}
        onMouseOver={e => e.currentTarget.style.background = '#106ebe'}
        onMouseOut={e => e.currentTarget.style.background = '#0078d4'}
      >
        <svg width="40" height="40" viewBox="0 0 23 23" fill="white">
          <path d="M0 0h11v11H0zM12 0h11v11H12zM0 12h11v11H0zM12 12h11v11H12z" />
        </svg>
        Login with Microsoft Teams
      </button>
    </div>
  );
};

// ============================
// AUTH CALLBACK – FIXED (no extra ] )
// ============================
const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');

    if (!code) {
      toast.error('No authorization code found', { toastId: 'no-code' });
      navigate('/');
      return;
    }

    toast.info('Fetching token from backend...\n(localhost:8000/auth/token)', { toastId: 'fetching' });

    fetch('http://localhost:8000/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, redirect_uri: SSO_CONFIG.redirectUri }),
    })
      .then(res => {
        if (!res.ok) throw new Error(`Server error ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (!data.access_token) throw new Error('No token received');

        localStorage.setItem('token', data.access_token);
        const decoded = jwtDecode(data.access_token);

        toast.success(`Logged in as ${decoded.role.toUpperCase()}!\nMFA: ${decoded.mfa_enabled ? 'Enabled' : 'Required'}`, {
          toastId: 'login-success'
        });

        if (!decoded.mfa_enabled) {
          toast.warn('MFA required – full implementation in T7', { toastId: 'mfa-warning' });
        }

        navigate('/dashboard');
      })
      .catch(err => {
        toast.error(`Access Denied\n${err.message}`, { toastId: 'login-error' });
        navigate('/');
      });
  }, [location, navigate]);   // ← FIXED: removed extra ]

  return null;
};

// ============================
// DASHBOARD PLACEHOLDER
// ============================
const DashboardPlaceholder = () => {
  const token = localStorage.getItem('token');
  const decoded = token ? jwtDecode(token) : null;
  const role = decoded ? decoded.role.toUpperCase() : 'unauthenticated';

  const logout = () => {
    localStorage.removeItem('token');
    toast.info('Logged out – redirecting...', { toastId: 'logout' });
    setTimeout(() => window.location.href = '/', 800);
  };

  return (
    <div style={{
      padding: '60px',
      fontFamily: "'Segoe UI', Arial, sans-serif",
      background: '#f8f9fa',
      minHeight: '100vh',
    }}>
      <h1 style={{ fontSize: '50px', color: '#203a43', marginBottom: '20px' }}>
        FAMAR Dashboard
      </h1>
      <p style={{ fontSize: '30px', marginBottom: '40px' }}>
        <strong>Logged in as: {role}</strong>
      </p>
      <p style={{ fontSize: '20px', color: '#444', maxWidth: '900px', lineHeight: '1.7' }}>
        Main Scenario (#385): System renders KPIs with Recharts<br />
        Next: filters, tooltips, export, role-based views
      </p>
      <button onClick={logout} style={{
        marginTop: '60px',
        padding: '16px 40px',
        background: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '22px',
        cursor: 'pointer',
      }}>
        Logout
      </button>
    </div>
  );
};

// ============================
// MAIN APP + HUGE TOASTS
// ============================
function App() {
  return (
    <Router>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
        toastStyle={{
          fontSize: '24px',
          padding: '30px 44px',
          borderRadius: '16px',
          minHeight: '100px',
          textAlign: 'center',
          whiteSpace: 'pre-line',
        }}
      />

      <Routes>
        <Route path="/" element={<SsoLogin />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/dashboard" element={<DashboardPlaceholder />} />
      </Routes>
    </Router>
  );
}

export default App;
