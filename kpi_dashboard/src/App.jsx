import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Home from './Components/Home.jsx';
import CompleteProfile from './Components/CompleteProfile.jsx';
import { authClient } from './utils/authClient.js'; // Better Auth client

const needsProfileCompletion = (user) =>
  !user?.username ||
  !user?.phone ||
  !user?.accountType ||
  user.username.startsWith('pending_') ||
  user.phone === '__pending__';

const RequireAuth = ({ children }) => {
  const location = useLocation();
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <div className="min-h-screen flex items-center justify-center text-gray-600">Checking session...</div>;
  }

  if (!session?.user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (needsProfileCompletion(session.user) && location.pathname !== '/complete-profile') {
    return <Navigate to="/complete-profile" replace />;
  }

  return children;
};

const RequireGuest = ({ children }) => {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <div className="min-h-screen flex items-center justify-center text-gray-600">Checking session...</div>;
  }

  if (session?.user) {
    if (needsProfileCompletion(session.user)) {
      return <Navigate to="/complete-profile" replace />;
    }
    return <Navigate to="/home" replace />;
  }

  return children;
};

const Login = () => {
  const { signIn, isPending } = authClient; // Better Auth signIn for "microsoft"

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-r from-red-400 via-slate-300 to-blue-400">
      <div className="bg-white p-24 rounded-3xl shadow-2xl text-center">
        <h1 className="text-7xl font-bold mb-16 text-gray-800">FAMAR KPI Dashboard</h1>
        <button
          onClick={() => signIn("microsoft")}
          disabled={isPending}
          className="px-20 py-10 bg-blue-600 hover:bg-blue-700 text-white text-4xl font-bold rounded-2xl shadow-2xl transition transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPending ? 'Signing in...' : 'Sign in with Microsoft'}
        </button>
      </div>
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<RequireGuest><Login /></RequireGuest>} /> {/* SSO button */}
      <Route path="/home" element={<RequireAuth><Home /></RequireAuth>} />
      <Route path="/complete-profile" element={<RequireAuth><CompleteProfile /></RequireAuth>} />
      {/* No /register – omitted for prod */}
    </Routes>
  );
}

export default App;