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
  const { signIn, isPending = false } = authClient;  // default false to avoid undefined
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    const { error } = await signIn.email({
      email,
      password,
    });
    if (error) {
      setError(error.message || "Failed to sign in");
    }
  };

  const handleMicrosoftLogin = () => {
    signIn("microsoft");
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-r from-red-400 via-slate-300 to-blue-400">
      <div className="bg-white p-12 rounded-3xl shadow-2xl w-full max-w-md">
        <h1 className="text-5xl font-bold mb-8 text-center text-gray-800">
          FAMAR KPI Dashboard
        </h1>

        {/* Email/Password Form */}
        <form onSubmit={handleEmailLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"  // added for email
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"  // fixes suggestion
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={!!isPending}  // fixes disabled warning
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition disabled:opacity-70"
          >
            {isPending ? "Signing in..." : "Sign in with Email"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-8 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-gray-500 text-sm">or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Microsoft Button */}
        <button
          onClick={handleMicrosoftLogin}
          disabled={!!isPending}  // fixes disabled warning
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition flex items-center justify-center gap-3 disabled:opacity-70"
        >
          <svg className="w-6 h-6" viewBox="0 0 23 23" fill="white">
            <path d="M0 0h11v11H0z" fill="#f3f3f3"/>
            <path d="M12 0h11v11H12z" fill="#f35325"/>
            <path d="M0 12h11v11H0z" fill="#81bc06"/>
            <path d="M12 12h11v11H12z" fill="#05a6f0"/>
          </svg>
          {isPending ? "Signing in..." : "Sign in with Microsoft"}
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