import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../utils/api';

const LandingPage = () => {
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState('');
  const [adType, setAdType] = useState('');
  const [propType, setPropType] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);

      const params = {};
      if (search) params.address = search;
      if (adType) params.adType = adType;
      if (propType) params.propertyType = propType;

      const res = await API.get('/properties', { params });

      // ✅ SAFE FIX (prevents map crash)
      const data = Array.isArray(res.data) ? res.data : [];

      setProperties(data);
    } catch (err) {
      console.error("Error fetching properties:", err);
      setProperties([]); // fallback safe state
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <div className="hero-section">
        <div>
          <h1 className="display-4 fw-bold">
            Find Your Dream Rental Property
          </h1>
          <p className="lead">
            Comfort, Convenience & Class — All in One Place
          </p>

          <div className="d-flex gap-3 justify-content-center mt-3">
            {[0, 1, 2, 3].map(i => (
              <span
                key={i}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor:
                    i === 3 ? '#6f42c1' : 'rgba(255,255,255,0.5)',
                  display: 'inline-block'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Properties Section */}
      <div className="container py-5">
        <h2 className="text-center fw-bold mb-2">
          Explore Our Premium Properties
        </h2>

        <p className="text-center text-muted mb-4">
          Looking to post your property?{' '}
          <Link to="/register" className="text-primary">
            Register as Owner
          </Link>
        </p>

        {/* Search / Filter */}
        <div className="row g-2 my-4">
          <div className="col-md-6">
            <input
              className="form-control"
              placeholder="Search by Address"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="col-md-2">
            <select
              className="form-select"
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
              className="form-select"
              value={propType}
              onChange={e => setPropType(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>

          <div className="col-md-2">
            <button
              className="btn btn-primary w-100"
              onClick={fetchProperties}
            >
              Search
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center text-muted">Loading properties...</p>
        )}

        {/* Properties List (SAFE MAP FIX) */}
        <div className="row g-4">
          {(properties || []).map(p => (
            <div key={p._id} className="col-md-4">
              <div className="card property-card h-100 shadow-sm">

                {p.images && p.images[0] ? (
                  <img
                    src={`/uploads/${p.images[0]}`}
                    className="card-img-top"
                    style={{ height: 200, objectFit: 'cover' }}
                    alt="property"
                  />
                ) : (
                  <div
                    style={{
                      height: 200,
                      background: '#ddd',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <span className="text-muted">No Image</span>
                  </div>
                )}

                <div className="card-body">
                  <p className="card-text text-muted small">
                    {p.address}
                  </p>

                  <p className="small">
                    <strong>{p.propertyType}</strong> - {p.adType}
                  </p>

                  <p className="small">Owner: +{p.ownerContact}</p>

                  <p className="small">
                    Availability:{' '}
                    <span
                      className={`badge ${
                        p.availability
                          ? 'bg-success'
                          : 'bg-danger'
                      }`}
                    >
                      {p.availability ? 'Available' : 'Unavailable'}
                    </span>
                  </p>

                  <p className="fw-bold">
                    ₹{p.amount?.toLocaleString()}
                  </p>

                  <Link
                    to="/login"
                    className="btn btn-primary btn-sm w-100"
                  >
                    Get Info / Book
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {/* Empty state */}
          {!loading && properties.length === 0 && (
            <p className="text-center text-muted">
              No properties found.
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3">
        <p className="mb-0">© 2025 RentEase. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
