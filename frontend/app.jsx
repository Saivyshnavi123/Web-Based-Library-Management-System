import './App.css';
import Login from './components/login/login';
import Register from './components/register/register';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/services/ProtectedRoute';
import Dashboard from './components/admin/admin-dashboard/admin-dashboard';
import AdminCards from './components/admin/admin-dashboard/admin-cards';
import AdminUsersList from './components/admin/admin-dashboard/admin-usersList';
import AdminReservations from './components/admin/admin-dashboard/admin-reservations';
import MyReservations from './components/admin/admin-dashboard/MyReservations';
import './styles/main.scss';

function App() {
  const username = sessionStorage.getItem("username") || "User";
  const role = sessionStorage.getItem("role");

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Librarian/Admin Dashboard - Protected */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard username={username} role={role} />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="cards" replace />} />
        <Route path="cards" element={<ProtectedRoute><AdminCards /></ProtectedRoute>} />
        <Route path="usersList" element={<ProtectedRoute><AdminUsersList /></ProtectedRoute>} />
        <Route path="reservations" element={<ProtectedRoute><AdminReservations /></ProtectedRoute>} />
      </Route>

      {/* Student Dashboard - Protected */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard username={username} role={role} />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="cards" replace />} />
        <Route path="cards" element={<ProtectedRoute><AdminCards /></ProtectedRoute>} />
        <Route path="MyReservations" element={<ProtectedRoute><MyReservations /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}

export default App;