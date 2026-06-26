import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../utils/api";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/auth/register", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const role = res.data.user.role;

      if (role === "owner") navigate("/owner");
      else if (role === "renter") navigate("/renter");
      else navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(rgba(0,0,0,.65),rgba(0,0,0,.65)),url('https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Navbar showAuth={false} />

      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "calc(100vh - 70px)" }}
      >
        <div
          className="shadow-lg"
          style={{
            width: "100%",
            maxWidth: "470px",
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(15px)",
            borderRadius: "20px",
            padding: "35px",
            color: "#fff",
          }}
        >
          <div className="text-center mb-4">
            <h1 style={{ fontSize: 55 }}>🏡</h1>

            <h2 className="fw-bold">Create Account</h2>

            <p className="text-light">
              Register to discover the best rental properties.
            </p>
          </div>

          {error && (
            <div className="alert alert-danger text-center">{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold">
                👤 Full Name
              </label>

              <input
                type="text"
                className="form-control"
                placeholder="Example: Rahul Sharma"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                required
              />

              <small className="text-light">
                Enter your full name.
              </small>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">
                📧 Email Address
              </label>

              <input
                type="email"
                className="form-control"
                placeholder="Example: rahul@gmail.com"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
              />

              <small className="text-light">
                We'll use this email for login.
              </small>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">
                🔒 Password
              </label>

              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Minimum 8 characters"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                />

                <button
                  type="button"
                  className="btn btn-outline-light"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <small className="text-light">
                Use a strong password containing letters and numbers.
              </small>
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold">
                👥 Register As
              </label>

              <select
                className="form-select"
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value })
                }
                required
              >
                <option value="">Choose your account type</option>
                <option value="renter">🏠 Renter</option>
                <option value="owner">🏢 Property Owner</option>
              </select>

              <small className="text-light">
                Select whether you want to rent properties or list your own.
              </small>
            </div>

            <button
              type="submit"
              className="btn w-100 text-white fw-bold"
              style={{
                background:
                  "linear-gradient(90deg,#4facfe,#00c6fb)",
                border: "none",
                borderRadius: "10px",
                padding: "12px",
                fontSize: "17px",
              }}
            >
              Create Account
            </button>

            <div className="text-center mt-4">
              <span className="text-light">
                Already have an account?
              </span>

              <Link
                to="/login"
                className="text-info fw-bold text-decoration-none ms-2"
              >
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;