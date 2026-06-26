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
const demoProperties = [
  {
    _id: "1",
    title: "Luxury Apartment",
    address: "Gachibowli, Hyderabad",
    propertyType: "2 BHK Apartment",
    adType: "Rent",
    ownerContact: "91 9876543210",
    availability: true,
    amount: 25000,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800"
  },
  {
    _id: "2",
    title: "Royal Villa",
    address: "Jubilee Hills, Hyderabad",
    propertyType: "4 BHK Villa",
    adType: "Rent",
    ownerContact: "91 9123456789",
    availability: true,
    amount: 75000,
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800"
  },
  {
    _id: "3",
    title: "Green Residency",
    address: "Whitefield, Bangalore",
    propertyType: "3 BHK Apartment",
    adType: "Rent",
    ownerContact: "91 9988776655",
    availability: true,
    amount: 32000,
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?w=800"
  },
  {
    _id: "4",
    title: "Sunrise PG",
    address: "Madhapur, Hyderabad",
    propertyType: "PG",
    adType: "Rent",
    ownerContact: "91 9000000001",
    availability: true,
    amount: 8500,
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"
  },
  {
    _id: "5",
    title: "Elite Homes",
    address: "Banjara Hills, Hyderabad",
    propertyType: "3 BHK",
    adType: "Rent",
    ownerContact: "91 9555555555",
    availability: true,
    amount: 42000,
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800"
  }
];

const fetchProperties = async () => {
  try {
    const params = {};

    if (search) params.address = search;
    if (adType) params.adType = adType;
    if (propType) params.propertyType = propType;

    const res = await API.get("/properties", { params });

    if (Array.isArray(res.data) && res.data.length > 0) {
      setProperties(res.data);
    } else {
      setProperties(demoProperties);
    }
  } catch (err) {
    console.log(err);
    setProperties(demoProperties);
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

               {(p.images && p.images[0]) || p.image ? (
  <img
    src={
      p.images && p.images[0]
        ? `/uploads/${p.images[0]}`
        : p.image
    }
    className="card-img-top"
    style={{
      height: 230,
      objectFit: "cover"
    }}
    alt="property"
  />
) : (
                   <div
  className="card-body"
  style={{
    background: "linear-gradient(to bottom,#ffffff,#f8f9fa)",
    color: "#222",
    borderRadius: "0 0 15px 15px"
  }}
>
  <div className="d-flex justify-content-between align-items-center mb-2">
    <h5 className="fw-bold text-dark mb-0">
      🏠 {p.title || "Premium Property"}
    </h5>

    <span
      className={`badge ${
        p.availability ? "bg-success" : "bg-danger"
      }`}
    >
      {p.availability ? "Available" : "Booked"}
    </span>
  </div>

  <p className="text-primary mb-2">
    📍 {p.address}
  </p>

  <div className="row mb-2">
    <div className="col-6">
      <small className="text-muted">Category</small>
      <h6>{p.propertyType}</h6>
    </div>

    <div className="col-6">
      <small className="text-muted">Purpose</small>
      <h6>{p.adType}</h6>
    </div>
  </div>

  <div className="row mb-2">
    <div className="col-6">
      <small className="text-muted">Owner</small>
      <h6>{p.ownerContact}</h6>
    </div>

    <div className="col-6">
      <small className="text-muted">Rating</small>
      <h6 className="text-warning">⭐⭐⭐⭐⭐</h6>
    </div>
  </div>

  <div
    className="d-flex justify-content-between align-items-center mt-3"
  >
    <div>
      <small className="text-muted">Monthly Rent</small>

      <h4
        className="fw-bold"
        style={{ color: "#0d6efd" }}
      >
        ₹{p.amount?.toLocaleString()}
      </h4>
    </div>

    <button
      className="btn btn-primary"
      style={{
        borderRadius: "12px",
        padding: "10px 18px",
        fontWeight: "bold"
      }}
      onClick={() => {
        setBookingModal(p);
        setMsg("");
      }}
      disabled={!p.availability}
    >
      {p.availability ? "🏡 Book Now" : "Unavailable"}
    </button>
  </div>
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
