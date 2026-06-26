import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import OwnerHome from './pages/OwnerHome';
import RenterHome from './pages/RenterHome';
import AdminHome from './pages/AdminHome';

const PrivateRoute = ({ children, roles }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!token || !user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/owner" element={
          <PrivateRoute roles={['owner']}>
            <OwnerHome />
          </PrivateRoute>
        } />
        <Route path="/renter" element={
          <PrivateRoute roles={['renter']}>
            <RenterHome />
          </PrivateRoute>
        } />
        <Route path="/admin" element={
          <PrivateRoute roles={['admin']}>
            <AdminHome />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
