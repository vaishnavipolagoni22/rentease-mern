import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../utils/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await API.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      const role = res.data.user.role;
      if (role === 'owner') navigate('/owner');
      else if (role === 'renter') navigate('/renter');
      else navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1e1e2e' }}>
      <Navbar showAuth={false} />
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 60px)' }}>
        <div className="dark-card" style={{ width: '100%', maxWidth: 400 }}>
          <div className="text-center mb-4">
            <div style={{ fontSize: 40 }}>🔒</div>
            <h4>Sign In</h4>
          </div>
          {error && <div className="alert alert-danger py-2">{error}</div>}
          <form onSubmit={handleSubmit}>
            <input className="form-control mb-3 bg-dark text-white border-secondary"
              type="email" placeholder="Email Address"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            <input className="form-control mb-3 bg-dark text-white border-secondary"
              type="password" placeholder="Password"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            <button type="submit" className="btn btn-primary w-100 mb-3">Sign In</button>
            <div className="d-flex justify-content-between">
              <span className="text-danger small" style={{ cursor: 'pointer' }}>Forgot Password?</span>
              <Link to="/register" className="text-primary small">Create an Account</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
