import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../utils/api";

const LoginPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const role = res.data.user.role;

      if (role === "owner") navigate("/owner");
      else if (role === "renter") navigate("/renter");
      else navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid Email or Password");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(rgba(0,0,0,.65), rgba(0,0,0,.65)), url('https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80')",
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
            maxWidth: "450px",
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(15px)",
            borderRadius: "20px",
            padding: "35px",
            color: "#fff",
          }}
        >
          <div className="text-center mb-4">
            <h1 style={{ fontSize: "55px" }}>🏡</h1>

            <h2 className="fw-bold">Welcome Back</h2>

            <p className="text-light">
              Login to continue exploring amazing rental properties.
            </p>
          </div>

          {error && (
            <div className="alert alert-danger text-center">{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold">
                📧 Email Address
              </label>

              <input
                type="email"
                className="form-control"
                placeholder="Enter your registered email (e.g. rahul@gmail.com)"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
              />

              <small className="text-light">
                Enter the email used while creating your account.
              </small>
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold">
                🔒 Password
              </label>

              <input
                type="password"
                className="form-control"
                placeholder="Enter your password (Minimum 8 characters)"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />

              <small className="text-light">
                Password is case-sensitive.
              </small>
            </div>

            <button
              type="submit"
              className="btn w-100 text-white fw-bold"
              style={{
                background:
                  "linear-gradient(90deg,#4facfe,#00c6fb)",
                borderRadius: "10px",
                padding: "12px",
                border: "none",
                fontSize: "17px",
              }}
            >
              Login
            </button>

            <div className="d-flex justify-content-between mt-4">
              <span
                className="text-warning"
                style={{ cursor: "pointer" }}
              >
                Forgot Password?
              </span>

              <Link
                to="/register"
                className="text-info text-decoration-none fw-bold"
              >
                Create Account
              </Link>
            </div>
          </form>

          <hr className="my-4 text-light" />

          <div className="text-center">
            <small className="text-light">
              Find your perfect rental property with
              <strong> RentEase</strong>.
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;