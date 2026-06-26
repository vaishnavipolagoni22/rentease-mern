import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import API from '../utils/api';

const AdminHome = () => {
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (tab === 'users') fetchUsers();
    if (tab === 'properties') fetchProperties();
    if (tab === 'bookings') fetchBookings();
  }, [tab]);

  const fetchUsers = async () => {
    const res = await API.get('/admin/users');
    setUsers(res.data);
  };

  const fetchProperties = async () => {
    const res = await API.get('/admin/properties');
    setProperties(res.data);
  };

  const fetchBookings = async () => {
    const res = await API.get('/admin/bookings');
    setBookings(res.data);
  };

  const toggleGrant = async (id) => {
    await API.put(`/admin/users/${id}/grant`);
    fetchUsers();
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1e1e2e' }}>
      <Navbar />
      <div className="container-fluid px-4 py-4">
        <div className="d-flex gap-3 mb-4">
          {['users', 'properties', 'bookings'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`btn btn-sm ${tab === t ? 'btn-primary' : 'btn-outline-secondary text-white'}`}>
              {t === 'users' ? 'All Users' : t === 'properties' ? 'All Properties' : 'All Bookings'}
            </button>
          ))}
        </div>

        {/* All Users */}
        {tab === 'users' && (
          <div>
            <h5 className="text-white mb-3">All Users</h5>
            <div className="table-responsive">
              <table className="table table-dark table-bordered">
                <thead>
                  <tr style={{ backgroundColor: '#6f42c1' }}>
                    <th>User ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Type</th>
                    <th>Granted (Owners Only)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td style={{ fontSize: '0.75rem' }}>{u._id}</td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`badge ${u.role === 'admin' ? 'bg-secondary' : u.role === 'owner' ? 'bg-primary' : 'bg-info'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>
                        {u.role === 'owner' ? (
                          <span className={`badge ${u.granted ? 'bg-success' : 'bg-warning text-dark'}`}>
                            {u.granted ? 'granted' : 'pending'}
                          </span>
                        ) : '-'}
                      </td>
                      <td>
                        {u.role === 'owner' && (
                          <button
                            className={`btn btn-sm ${u.granted ? 'btn-danger' : 'btn-success'}`}
                            onClick={() => toggleGrant(u._id)}>
                            {u.granted ? 'Ungrant' : 'Grant'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* All Properties */}
        {tab === 'properties' && (
          <div>
            <h5 className="text-white mb-3">All Properties</h5>
            <div className="table-responsive">
              <table className="table table-dark table-bordered">
                <thead>
                  <tr style={{ backgroundColor: '#6f42c1' }}>
                    <th>Property ID</th>
                    <th>Owner ID</th>
                    <th>Property Type</th>
                    <th>Property Ad Type</th>
                    <th>Property Address</th>
                    <th>Owner Contact</th>
                    <th>Property Amt</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map(p => (
                    <tr key={p._id}>
                      <td style={{ fontSize: '0.75rem' }}>{p._id}</td>
                      <td style={{ fontSize: '0.75rem' }}>{p.owner?._id || p.owner}</td>
                      <td><span className="badge bg-primary">{p.propertyType}</span></td>
                      <td>{p.adType}</td>
                      <td>{p.address}</td>
                      <td>+{p.ownerContact}</td>
                      <td className="text-success fw-bold">₹{p.amount?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* All Bookings */}
        {tab === 'bookings' && (
          <div>
            <h5 className="text-white mb-3">All Bookings</h5>
            <div className="table-responsive">
              <table className="table table-dark table-bordered">
                <thead>
                  <tr style={{ backgroundColor: '#6f42c1' }}>
                    <th>Booking ID</th>
                    <th>Owner ID</th>
                    <th>Property ID</th>
                    <th>Tenant ID</th>
                    <th>Tenant Name</th>
                    <th>Phone</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b._id}>
                      <td style={{ fontSize: '0.75rem' }}>{b._id}</td>
                      <td style={{ fontSize: '0.75rem' }}>{b.owner?._id || b.owner}</td>
                      <td style={{ fontSize: '0.75rem', color: '#6f42c1' }}>{b.property?._id || b.property}</td>
                      <td style={{ fontSize: '0.75rem' }}>{b.tenant?._id || b.tenant}</td>
                      <td>{b.tenantName}</td>
                      <td>{b.tenantPhone}</td>
                      <td>
                        <span className={`badge ${b.status === 'booked' ? 'bg-success' : 'bg-warning text-dark'}`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHome;
