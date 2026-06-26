import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../utils/api';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await API.post('/auth/register', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      const role = res.data.user.role;
      if (role === 'owner') navigate('/owner');
      else if (role === 'renter') navigate('/renter');
      else navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1e1e2e' }}>
      <Navbar showAuth={false} />
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 60px)' }}>
        <div className="dark-card" style={{ width: '100%', maxWidth: 420 }}>
          <div className="text-center mb-4">
            <div style={{ fontSize: 40 }}>📋</div>
            <h4>Sign Up</h4>
          </div>
          {error && <div className="alert alert-danger py-2">{error}</div>}
          <form onSubmit={handleSubmit}>
            <input className="form-control mb-3 bg-dark text-white border-secondary"
              placeholder="Renter Full Name / Owner Name"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            <input className="form-control mb-3 bg-dark text-white border-secondary"
              type="email" placeholder="Email Address"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            <input className="form-control mb-3 bg-dark text-white border-secondary"
              type="password" placeholder="Password"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            <select className="form-select mb-3 bg-dark text-white border-secondary"
              value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} required>
              <option value="">Select User Type</option>
              <option value="renter">Renter</option>
              <option value="owner">Owner</option>
            </select>
            <button type="submit" className="btn btn-primary w-100 mb-3">Sign Up</button>
            <p className="text-center text-danger small">
              Have an account? <Link to="/login" className="text-primary">Sign In</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
