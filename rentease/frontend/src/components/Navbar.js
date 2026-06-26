import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ showAuth = true }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return null;
    if (user.role === 'owner') return '/owner';
    if (user.role === 'renter') return '/renter';
    if (user.role === 'admin') return '/admin';
  };

  return (
    <nav className="navbar navbar-dark" style={{ backgroundColor: '#1e1e2e' }}>
      <div className="container-fluid px-4">
        <Link className="navbar-brand" to="/">RentEase</Link>
        <div className="d-flex align-items-center gap-3">
          {user ? (
            <>
              <span className="text-white">Hi {user.name}</span>
              <button onClick={logout} className="btn btn-danger btn-sm">Log Out</button>
            </>
          ) : showAuth ? (
            <>
              <Link to="/" className="text-white text-decoration-none">Home</Link>
              <Link to="/login" className="text-white text-decoration-none">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
