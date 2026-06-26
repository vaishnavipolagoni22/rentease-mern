import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import API from '../utils/api';

const RenterHome = () => {
  const [tab, setTab] = useState('properties');
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState('');
  const [adType, setAdType] = useState('');
  const [propType, setPropType] = useState('');
  const [bookingModal, setBookingModal] = useState(null);
  const [bookForm, setBookForm] = useState({ tenantName: '', tenantPhone: '' });
  const [msg, setMsg] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (tab === 'properties') fetchProperties();
    if (tab === 'history') fetchBookings();
  }, [tab]);

  // ✅ FIXED: safe response handling
  const fetchProperties = async () => {
    try {
      const params = {};
      if (search) params.address = search;
      if (adType) params.adType = adType;
      if (propType) params.propertyType = propType;

      const res = await API.get('/properties', { params });

      const data = Array.isArray(res.data) ? res.data : [];
      setProperties(data);
    } catch (err) {
      console.log(err);
      setProperties([]);
    }
  };

  // ✅ FIXED: safe response handling
  const fetchBookings = async () => {
    try {
      const res = await API.get('/bookings/my');

      const data = Array.isArray(res.data) ? res.data : [];
      setBookings(data);
    } catch (err) {
      console.log(err);
      setBookings([]);
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    try {
      await API.post('/bookings', {
        propertyId: bookingModal._id,
        ...bookForm
      });

      setMsg('Booking submitted successfully!');
      setBookingModal(null);
      setBookForm({ tenantName: '', tenantPhone: '' });
    } catch (err) {
      setMsg(err.response?.data?.message || 'Booking failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1e1e2e' }}>
      <Navbar />

      <div className="container-fluid px-4 py-4">

        {/* Tabs */}
        <div className="d-flex gap-3 mb-4">
          <button
            onClick={() => setTab('properties')}
            className={`btn btn-sm ${tab === 'properties' ? 'btn-primary' : 'btn-outline-secondary text-white'}`}
          >
            All Properties
          </button>

          <button
            onClick={() => setTab('history')}
            className={`btn btn-sm ${tab === 'history' ? 'btn-primary' : 'btn-outline-secondary text-white'}`}
          >
            Booking History
          </button>
        </div>

        {msg && <div className="alert alert-info py-2">{msg}</div>}

        {/* ================= PROPERTIES ================= */}
        {tab === 'properties' && (
          <div>

            {/* Filters */}
            <div className="row g-2 mb-4">
              <div className="col-md-5">
                <input
                  className="form-control bg-dark text-white border-secondary"
                  placeholder="Search by Address"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              <div className="col-md-2">
                <select
                  className="form-select bg-dark text-white border-secondary"
                  value={adType}
                  onChange={e => setAdType(e.target.value)}
                >
                  <option value="">All Ad Types</option>
                  <option value="rent">Rent</option>
                  <option value="sale">Sale</option>
                </select>
              </div>

              <div className="col-md-2">
                <select
                  className="form-select bg-dark text-white border-secondary"
                  value={propType}
                  onChange={e => setPropType(e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              <div className="col-md-2">
                <button className="btn btn-primary w-100" onClick={fetchProperties}>
                  Search
                </button>
              </div>
            </div>

            {/* Properties List */}
            <div className="row g-4">
              {(properties || []).map(p => (
                <div key={p._id} className="col-md-4">
                  <div
                    className="card h-100"
                    style={{ backgroundColor: '#2a2a3e', color: 'white', border: 'none' }}
                  >

                    {p.images && p.images[0] ? (
                      <img
                        src={`/uploads/${p.images[0]}`}
                        className="card-img-top"
                        style={{ height: 200, objectFit: 'cover' }}
                        alt="property"
                      />
                    ) : (
                      <div style={{ height: 200, background: '#444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="text-muted">No Image</span>
                      </div>
                    )}

                    <div className="card-body">
                      <p className="small fw-bold">{p.address}</p>
                      <p className="small">{p.propertyType} - {p.adType}</p>
                      <p className="small">Owner: +{p.ownerContact}</p>

                      <p className="small">
                        Availability:{' '}
                        <span className={`badge ${p.availability ? 'bg-success' : 'bg-danger'}`}>
                          {p.availability ? 'Available' : 'Unavailable'}
                        </span>
                      </p>

                      <p className="fw-bold">Price: ₹{p.amount?.toLocaleString()}</p>

                      {p.availability ? (
                        <button
                          className="btn btn-primary btn-sm w-100"
                          onClick={() => { setBookingModal(p); setMsg(''); }}
                        >
                          Get Info / Book
                        </button>
                      ) : (
                        <button className="btn btn-secondary btn-sm w-100" disabled>
                          Not Available
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= HISTORY ================= */}
        {tab === 'history' && (
          <div>
            <h5 className="text-white mb-3">All My Bookings</h5>

            <div className="table-responsive">
              <table className="table table-dark table-bordered">
                <thead>
                  <tr style={{ backgroundColor: '#6f42c1' }}>
                    <th>Booking ID</th>
                    <th>Property ID</th>
                    <th>Tenant Name</th>
                    <th>Phone</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {(bookings || []).map(b => (
                    <tr key={b._id}>
                      <td style={{ fontSize: '0.75rem' }}>{b._id}</td>
                      <td style={{ fontSize: '0.75rem' }}>
                        {b.property?._id || b.property}
                      </td>
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

      {/* ================= MODAL ================= */}
      {bookingModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-white">

              <div className="modal-header border-secondary">
                <h5 className="modal-title">Book Property</h5>
                <button className="btn-close btn-close-white" onClick={() => setBookingModal(null)} />
              </div>

              <div className="modal-body">
                <p><strong>Address:</strong> {bookingModal.address}</p>
                <p><strong>Amount:</strong> ₹{bookingModal.amount?.toLocaleString()}</p>

                <form onSubmit={handleBook}>
                  <input
                    className="form-control bg-dark text-white border-secondary mb-3"
                    placeholder="Your Full Name"
                    value={bookForm.tenantName}
                    onChange={e => setBookForm({ ...bookForm, tenantName: e.target.value })}
                    required
                  />

                  <input
                    className="form-control bg-dark text-white border-secondary mb-3"
                    placeholder="Your Phone Number"
                    value={bookForm.tenantPhone}
                    onChange={e => setBookForm({ ...bookForm, tenantPhone: e.target.value })}
                    required
                  />

                  <button type="submit" className="btn btn-primary w-100">
                    Confirm Booking
                  </button>
                </form>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default RenterHome;
