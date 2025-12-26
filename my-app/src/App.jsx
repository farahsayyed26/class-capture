import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { auth } from './firebase'; // Ensure your firebase config is imported
import { useAuthState } from 'react-firebase-hooks/auth';

import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Registration from './pages/Registration';

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />

      <Routes>
        {/* 1. Neutral Route: Home is always accessible */}
        <Route path="/" element={<Home />} />

        {/* 2. Public-Only Routes: Logged-in users are bounced to dashboard */}
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/registration"
          element={user ? <Navigate to="/dashboard" replace /> : <Registration />}
        />

        {/* 3. Protected Route: Logged-out users are bounced to home or login */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/" replace />}
        />

        {/* 4. Catch-all: Redirects to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;