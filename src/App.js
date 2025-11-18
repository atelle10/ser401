import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { toast, ToastContainer } from 'react-toastify';   // ← Fixed here
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
      'Redirecting to Microsoft SSO... (T1 Mock)\nManually change URL to /auth/callback?code=mockcode to simulate login',
      { autoClose: 10000, position: 'top-center' }
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
        fontSize: '54px',
        fontWeight: '700',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: '16px',
        textShadow: '0 4px 15px rgba(0,0,0,0.6)',
        letterSpacing: '1.5px',
      }}>
        FAMAR Dashboard Login
      </h1>

      <h2 style={{
        fontSize: '32px',
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
        padding: '16px 36px',
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
          padding: '22px 60px',
          background: '#0078d4',
          color: 'white',
          border: 'none',
          borderRadius: '14px',
          cursor: 'pointer',
          boxShadow: '0 12px 35px rgba(0,120,212,0.6)',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '18px',
        }}
        onMouseOver={e => e.currentTarget.style.background = '#106ebe'}
        onMouseOut={e => e.currentTarget.style.background = '#0078d4'}
      >
        <svg width="36" height="36" viewBox="0 0 23 23" fill="white">
          <path d="M0 0h11v11H0zM12 0h11v11H12zM0 12h11v11H0zM12 12h11v11H12z" />
        </svg>
        Login with Microsoft Teams
      </button>
    </div>
  );
};

// ============================
// AUTH CALLBACK
// ============================
const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');

    if (code) {
      toast.info('Fetching token from backend...\n(localhost:8000/auth/token)', { autoClose: 5000 });

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
          if (data.access_token) {
            localStorage.setItem('token', data.access_token);
            const decoded = jwtDecode(data.access_token);

            toast.success(`Logged in as ${decoded.role.toUpperCase()}!\nMFA: ${decoded.mfa_enabled ? 'Enabled' : 'Required'}`, {
              autoClose: 6000,
            });

            if (!decoded.mfa_enabled) {
              toast.warn('MFA required – full implementation in T7', { autoClose: 6000 });
            }

            navigate('/dashboard');
          } else {
            throw new Error('No token received');
          }
        })
        .catch(err => {
          toast.error(`Access Denied\n${err.message}`, { autoClose: 8000 });
          navigate('/');
        });
    } else {
      toast.error('No authorization code found', { autoClose: 8000 });
      navigate('/');
    }
  }, [location, navigate]);

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
    toast.info('Logged out – redirecting...', { autoClose: 3000 });
    setTimeout(() => (window.location.href = '/'), 500);
  };

  return (
    <div style={{
      padding: '50px',
      fontFamily: "'Segoe UI', Arial, sans-serif",
      background: '#f8f9fa',
      minHeight: '100vh',
    }}>
      <h1 style={{ fontSize: '48px', color: '#203a43', marginBottom: '20px' }}>
        FAMAR Dashboard
      </h1>
      <p style={{ fontSize: '28px', marginBottom: '40px' }}>
        <strong>Logged in as: {role}</strong>
      </p>
      <p style={{ fontSize: '20px', color: '#444', maxWidth: '900px', lineHeight: '1.7' }}>
        Main Scenario (#385): System renders KPIs with Recharts<br />
        Next steps: filters, hover tooltips, zoom, export, etc.
      </p>
      <button onClick={logout} style={{
        marginTop: '50px',
        padding: '14px 36px',
        background: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        fontSize: '20px',
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
          padding: '28px 40px',
          borderRadius: '16px',
          minHeight: '90px',
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
