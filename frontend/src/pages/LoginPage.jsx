import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import "bootstrap/dist/css/bootstrap.min.css";

function LoginPage() {
  const [values, setValues] = useState({
    email: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/login", {
        ...values,
        rememberMe,
      }, { withCredentials: true });

      const userRole = res.data.user?.role;

      if (userRole) {
        login(userRole);
      }

      switch (userRole) {
        case "admin":
          navigate("/admin-dashboard");
          break;
        case "seller":
          navigate("/seller-home");
          break;
        case "customer":
          navigate("/home");
          break;
        default:
          alert("Unknown role. Please contact support.");
          break;
      }

    } catch (err) {
      const msg = err.response?.data?.message || "An unexpected error occurred.";
      alert(msg);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="row justify-content-center w-100">
        <div className="col-md-6 col-lg-5">
          <div className="card border-0 shadow-lg rounded-4">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold text-primary mb-2">Welcome Back</h2>
                <p className="text-muted">Please sign in to continue</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label text-muted">Email address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-envelope text-muted"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control border-start-0"
                      placeholder="Enter your email"
                      value={values.email}
                      onChange={e => setValues({ ...values, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label text-muted">Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-lock text-muted"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control border-start-0"
                      placeholder="Enter your password"
                      value={values.password}
                      onChange={e => setValues({ ...values, password: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="formCheck"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                    />
                    <label htmlFor="formCheck" className="form-check-label text-muted">
                      Remember me
                    </label>
                  </div>
                  <a href="#" className="text-decoration-none text-primary">Forgot Password?</a>
                </div>

                <button type="submit" className="btn btn-primary w-100 py-2 mb-3">
                  Sign In
                </button>

                <div className="text-center">
                  <p className="text-muted mb-0">
                    Don't have an account?{" "}
                    <Link to="/" className="text-primary text-decoration-none fw-bold">
                      Sign Up
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;