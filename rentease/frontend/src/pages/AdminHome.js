import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import API from '../utils/api';

const AdminHome = () => {
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);import React, { useState, useEffect } from 'react';
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

  // ✅ SAFE FETCH USERS
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/users');
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ SAFE FETCH PROPERTIES
  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/properties');
      setProperties(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ SAFE FETCH BOOKINGS
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/bookings');
      setBookings(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleGrant = async (id) => {
    try {
      await API.put(`/admin/users/${id}/grant`);
      fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1e1e2e' }}>
      <Navbar />

      <div className="container-fluid px-4 py-4">

        {/* Tabs */}
        <div className="d-flex gap-3 mb-4">
          {['users', 'properties', 'bookings'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`btn btn-sm ${
                tab === t ? 'btn-primary' : 'btn-outline-secondary text-white'
              }`}
            >
              {t === 'users'
                ? 'All Users'
                : t === 'properties'
                ? 'All Properties'
                : 'All Bookings'}
            </button>
          ))}
        </div>

        {loading && <p className="text-white">Loading...</p>}

        {/* USERS */}
        {tab === 'users' && (
          <div>
            <h5 className="text-white mb-3">All Users</h5>

            <div className="table-responsive">
              <table className="table table-dark table-bordered">
                <tbody>
                  {(users || []).map(u => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PROPERTIES */}
        {tab === 'properties' && (
          <div>
            <h5 className="text-white mb-3">All Properties</h5>

            <table className="table table-dark table-bordered">
              <tbody>
                {(properties || []).map(p => (
                  <tr key={p._id}>
                    <td>{p.address}</td>
                    <td>{p.adType}</td>
                    <td>{p.propertyType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* BOOKINGS */}
        {tab === 'bookings' && (
          <div>
            <h5 className="text-white mb-3">All Bookings</h5>

            <table className="table table-dark table-bordered">
              <tbody>
                {(bookings || []).map(b => (
                  <tr key={b._id}>
                    <td>{b.tenantName}</td>
                    <td>{b.tenantPhone}</td>
                    <td>{b.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminHome;

  useEffect(() => {
    if (tab === 'users') fetchUsers();
    if (tab === 'properties') fetchProperties();
    if (tab === 'bookings') fetchBookings();
  }, [tab]);

  // ✅ SAFE USERS FETCH
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/users');
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ SAFE PROPERTIES FETCH
  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/properties');
      setProperties(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ SAFE BOOKINGS FETCH
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/bookings');
      setBookings(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleGrant = async (id) => {
    try {
      await API.put(`/admin/users/${id}/grant`);
      fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1e1e2e' }}>
      <Navbar />

      <div className="container-fluid px-4 py-4">

        {/* Tabs */}
        <div className="d-flex gap-3 mb-4">
          {['users', 'properties', 'bookings'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`btn btn-sm ${
                tab === t
                  ? 'btn-primary'
                  : 'btn-outline-secondary text-white'
              }`}
            >
              {t === 'users'
                ? 'All Users'
                : t === 'properties'
                ? 'All Properties'
                : 'All Bookings'}
            </button>
          ))}
        </div>

        {loading && (
          <p className="text-muted text-center">Loading...</p>
        )}

        {/* ================= USERS ================= */}
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
                    <th>Granted</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {(users || []).map(u => (
                    <tr key={u._id}>
                      <td style={{ fontSize: '0.75rem' }}>{u._id}</td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span
                          className={`badge ${
                            u.role === 'admin'
                              ? 'bg-secondary'
                              : u.role === 'owner'
                              ? 'bg-primary'
                              : 'bg-info'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td>
                        {u.role === 'owner' ? (
                          <span
                            className={`badge ${
                              u.granted
                                ? 'bg-success'
                                : 'bg-warning text-dark'
                            }`}
                          >
                            {u.granted ? 'granted' : 'pending'}
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>

                      <td>
                        {u.role === 'owner' && (
                          <button
                            className={`btn btn-sm ${
                              u.granted
                                ? 'btn-danger'
                                : 'btn-success'
                            }`}
                            onClick={() => toggleGrant(u._id)}
                          >
                            {u.granted ? 'Revoke' : 'Grant'}
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

        {/* ================= PROPERTIES ================= */}
        {tab === 'properties' && (
          <div>
            <h5 className="text-white mb-3">All Properties</h5>

            <div className="table-responsive">
              <table className="table table-dark table-bordered">
                <thead>
                  <tr style={{ backgroundColor: '#6f42c1' }}>
                    <th>Property ID</th>
                    <th>Owner ID</th>
                    <th>Type</th>
                    <th>Ad Type</th>
                    <th>Address</th>
                    <th>Contact</th>
                    <th>Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {(properties || []).map(p => (
                    <tr key={p._id}>
                      <td style={{ fontSize: '0.75rem' }}>{p._id}</td>
                      <td style={{ fontSize: '0.75rem' }}>
                        {p.owner?._id || p.owner}
                      </td>
                      <td>
                        <span className="badge bg-primary">
                          {p.propertyType}
                        </span>
                      </td>
                      <td>{p.adType}</td>
                      <td>{p.address}</td>
                      <td>+{p.ownerContact}</td>
                      <td className="text-success fw-bold">
                        ₹{p.amount?.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= BOOKINGS ================= */}
        {tab === 'bookings' && (
          <div>
            <h5 className="text-white mb-3">All Bookings</h5>

            <div className="table-responsive">
              <table className="table table-dark table-bordered">
                <thead>
                  <tr style={{ backgroundColor: '#6f42c1' }}>
                    <th>Booking ID</th>
                    <th>Owner</th>
                    <th>Property</th>
                    <th>Tenant</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {(bookings || []).map(b => (
                    <tr key={b._id}>
                      <td style={{ fontSize: '0.75rem' }}>{b._id}</td>
                      <td style={{ fontSize: '0.75rem' }}>
                        {b.owner?._id || b.owner}
                      </td>
                      <td style={{ fontSize: '0.75rem' }}>
                        {b.property?._id || b.property}
                      </td>
                      <td style={{ fontSize: '0.75rem' }}>
                        {b.tenant?._id || b.tenant}
                      </td>
                      <td>{b.tenantName}</td>
                      <td>{b.tenantPhone}</td>
                      <td>
                        <span
                          className={`badge ${
                            b.status === 'booked'
                              ? 'bg-success'
                              : 'bg-warning text-dark'
                          }`}
                        >
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
