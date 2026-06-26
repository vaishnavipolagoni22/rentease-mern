import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import API from '../utils/api';

const AdminHome = () => {
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tab === 'users') fetchUsers();
    if (tab === 'properties') fetchProperties();
    if (tab === 'bookings') fetchBookings();
  }, [tab]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/users');
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/properties');
      setProperties(Array.isArray(res.data) ? res.data : []);
    } catch {
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/bookings');
      setBookings(Array.isArray(res.data) ? res.data : []);
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleGrant = async (id) => {
    try {
      await API.put(`/admin/users/${id}/grant`);
      fetchUsers();
    } catch {}
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1e1e2e' }}>
      <Navbar />

      <div className="container-fluid px-4 py-4">

        <div className="d-flex gap-3 mb-4">
          {['users', 'properties', 'bookings'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`btn btn-sm ${
                tab === t ? 'btn-primary' : 'btn-outline-secondary text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'users' && (
          <table className="table table-dark">
            <tbody>
              {(users || []).map(u => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'properties' && (
          <table className="table table-dark">
            <tbody>
              {(properties || []).map(p => (
                <tr key={p._id}>
                  <td>{p.address}</td>
                  <td>{p.adType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'bookings' && (
          <table className="table table-dark">
            <tbody>
              {(bookings || []).map(b => (
                <tr key={b._id}>
                  <td>{b.tenantName}</td>
                  <td>{b.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>
    </div>
  );
};

export default AdminHome;