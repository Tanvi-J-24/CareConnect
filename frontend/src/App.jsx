import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import BookAppointment from './pages/BookAppointment';
import MyAppointments from './pages/MyAppointments';
import Emergency from './pages/Emergency';
import BloodSearch from './pages/BloodSearch';
import Facilities from './pages/Facilities';
import ClinicDashboard from './pages/ClinicDashboard';
import Login from './pages/Login';

const HomeRouter = ({ user }) => {
  if (user?.role === 'clinic') return <ClinicDashboard user={user} />;
  return <Dashboard />;
};

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('careconnect_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('careconnect_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('careconnect_user');
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Routes>
      <Route path="/" element={<Layout user={user} onLogout={handleLogout} />}>
        <Route index element={<HomeRouter user={user} />} />
        {user.role === 'patient' && (
          <>
            <Route path="book" element={<BookAppointment user={user} />} />
            <Route path="appointments" element={<MyAppointments user={user} />} />
            <Route path="emergency" element={<Emergency user={user} />} />
            <Route path="blood" element={<BloodSearch />} />
            <Route path="facilities" element={<Facilities />} />
          </>
        )}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
