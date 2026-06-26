import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import API from '../utils/api';

const OwnerHome = () => {
  const [tab, setTab] = useState('add');
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({
    propertyType: 'residential', adType: 'rent', address: '',
    ownerContact: '', amount: 0, additionalDetails: ''
  });
  const [images, setImages] = useState([]);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (tab === 'properties') fetchProperties();
    if (tab === 'bookings') fetchBookings();
  }, [tab]);

  const fetchProperties = async () => {
    const res = await API.get('/properties/my');
    setProperties(res.data);
  };

  const fetchBookings = async () => {
    const res = await API.get('/bookings/owner');
    setBookings(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    images.forEach(img => data.append('images', img));
    try {
      if (editId) {
        await API.put(`/properties/${editId}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
        setMsg('Property updated!');
      } else {
        await API.post('/properties', data, { headers: { 'Content-Type': 'multipart/form-data' } });
        setMsg('Property added!');
      }
      setForm({ propertyType: 'residential', adType: 'rent', address: '', ownerContact: '', amount: 0, additionalDetails: '' });
      setImages([]);
      setEditId(null);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error');
    }
  };

  const handleEdit = (p) => {
    setForm({ propertyType: p.propertyType, adType: p.adType, address: p.address, ownerContact: p.ownerContact, amount: p.amount, additionalDetails: p.additionalDetails || '' });
    setEditId(p._id);
    setTab('add');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this property?')) {
      await API.delete(`/properties/${id}`);
      fetchProperties();
    }
  };

  const handleStatusChange = async (bookingId, status) => {
    await API.put(`/bookings/${bookingId}/status`, { status });
    fetchBookings();
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1e1e2e' }}>
      <Navbar />
      <div className="container-fluid px-4 py-4">
        {/* Tabs */}
        <div className="d-flex gap-3 mb-4">
          {['add', 'properties', 'bookings'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`btn btn-sm ${tab === t ? 'btn-primary' : 'btn-outline-secondary text-white'}`}>
              {t === 'add' ? 'Add Property' : t === 'properties' ? 'All Properties' : 'All Bookings'}
            </button>
          ))}
        </div>

        {/* Add/Edit Property */}
        {tab === 'add' && (
          <div className="dark-card mx-auto" style={{ maxWidth: 700 }}>
            <h5 className="mb-4">{editId ? 'Edit Property' : 'Add New Property'}</h5>
            {msg && <div className="alert alert-info py-2">{msg}</div>}
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="text-white small">Property Type</label>
                  <select className="form-select bg-dark text-white border-secondary"
                    value={form.propertyType} onChange={e => setForm({ ...form, propertyType: e.target.value })}>
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="text-white small">Property Ad Type</label>
                  <select className="form-select bg-dark text-white border-secondary"
                    value={form.adType} onChange={e => setForm({ ...form, adType: e.target.value })}>
                    <option value="rent">Rent</option>
                    <option value="sale">Sale</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="text-white small">Property Full Address</label>
                  <input className="form-control bg-dark text-white border-secondary"
                    placeholder="Address" value={form.address}
                    onChange={e => setForm({ ...form, address: e.target.value })} required />
                </div>
                <div className="col-md-4">
                  <label className="text-white small">Property Images</label>
                  <input type="file" className="form-control bg-dark text-white border-secondary"
                    multiple accept="image/*" onChange={e => setImages([...e.target.files])} />
                </div>
                <div className="col-md-4">
                  <label className="text-white small">Owner Contact No.</label>
                  <input className="form-control bg-dark text-white border-secondary"
                    placeholder="Contact number" value={form.ownerContact}
                    onChange={e => setForm({ ...form, ownerContact: e.target.value })} required />
                </div>
                <div className="col-md-4">
                  <label className="text-white small">Property Amount</label>
                  <input type="number" className="form-control bg-dark text-white border-secondary"
                    value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />
                </div>
                <div className="col-12">
                  <label className="text-white small">Additional Details for the Property</label>
                  <textarea className="form-control bg-dark text-white border-secondary"
                    rows={4} placeholder="Add any details here..."
                    value={form.additionalDetails}
                    onChange={e => setForm({ ...form, additionalDetails: e.target.value })} />
                </div>
              </div>
              <div className="text-end mt-4">
                <button type="submit" className="btn btn-primary px-4">
                  {editId ? 'Update Property' : 'Submit Form'}
                </button>
              </div>
            </form>
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
                    <th>Property Type</th>
                    <th>Ad Type</th>
                    <th>Address</th>
                    <th>Owner Contact</th>
                    <th>Amount</th>
                    <th>Availability</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map(p => (
                    <tr key={p._id}>
                      <td style={{ fontSize: '0.75rem' }}>{p._id}</td>
                      <td>{p.propertyType}</td>
                      <td>{p.adType}</td>
                      <td>{p.address}</td>
                      <td>+{p.ownerContact}</td>
                      <td>₹{p.amount?.toLocaleString()}</td>
                      <td>
                        <span className={`badge ${p.availability ? 'bg-success' : 'bg-danger'}`}>
                          {p.availability ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(p)}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p._id)}>Delete</button>
                      </td>
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
                    <th>Property ID</th>
                    <th>Tenant Name</th>
                    <th>Tenant Phone</th>
                    <th>Booking Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b._id}>
                      <td style={{ fontSize: '0.75rem' }}>{b._id}</td>
                      <td style={{ fontSize: '0.75rem' }}>{b.property?._id || b.property}</td>
                      <td>{b.tenantName}</td>
                      <td>{b.tenantPhone}</td>
                      <td>
                        <span className={`badge ${b.status === 'booked' ? 'bg-success' : 'bg-warning text-dark'}`}>
                          {b.status}
                        </span>
                      </td>
                      <td>
                        {b.status === 'pending' ? (
                          <button className="btn btn-sm btn-success"
                            onClick={() => handleStatusChange(b._id, 'booked')}>Mark Booked</button>
                        ) : (
                          <button className="btn btn-sm btn-warning"
                            onClick={() => handleStatusChange(b._id, 'pending')}>Mark Pending</button>
                        )}
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

export default OwnerHome;
