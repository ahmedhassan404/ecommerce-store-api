import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import "bootstrap/dist/css/bootstrap.min.css";

function SignUpPage() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
    profileImage: null,
  });

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValues({ ...values, profileImage: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!agreeTerms) {
      alert("You must agree to the terms and conditions.");
      return;
    }

    if (!validatePassword(values.password)) {
      alert("Password must be at least 8 characters long and include an uppercase letter, lowercase letter, number, and special character.");
      return;
    }

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("role", values.role);
    formData.append("profileImage", values.profileImage);

    try {
      const res = await axios.post("/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      alert(res.data.message);
      login(values.role);

      switch (values.role) {
        case "admin":
          navigate("/admin-dashboard");
          break;
        case "seller":
          navigate("/seller-home");
          break;
        default:
          navigate("/home");
          break;
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
  <div
    className="row justify-content-center border rounded-5 p-3 bg-white shadow box-area"
    style={{ width: "100%", maxWidth: "500px" }}
  >
    <div className="col-12">
      <div className="row align-items-center text-center">
        <div className="header-text mb-4">
          <h2>Signup</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control form-control-lg bg-light fs-6"
              placeholder="Username"
              value={values.name}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="email"
              className="form-control form-control-lg bg-light fs-6"
              placeholder="Email"
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control form-control-lg bg-light fs-6"
              placeholder="Password"
              value={values.password}
              onChange={(e) => setValues({ ...values, password: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <select
              className="form-select"
              value={values.role}
              onChange={(e) => setValues({ ...values, role: e.target.value })}
            >
              <option value="customer">Customer</option>
              <option value="seller">Seller</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="mb-3">
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={handleImageChange}
            />
          </div>

          {previewImage && (
            <div className="mb-3">
              <img
                src={previewImage}
                alt="Preview"
                className="rounded-circle"
                width="100"
                height="100"
              />
            </div>
          )}

          <div className="mb-3 d-flex justify-content-between align-items-center">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="formCheck"
                checked={agreeTerms}
                onChange={() => setAgreeTerms(!agreeTerms)}
              />
              <label htmlFor="formCheck" className="form-check-label text-secondary">
                <small>Agree to Terms and Conditions</small>
              </label>
            </div>
          </div>

          <div className="mb-3">
            <button type="submit" className="btn btn-lg btn-primary w-100 fs-6">
              SIGN UP
            </button>
          </div>
        </form>

        <div className="row">
          <small>
            Already have an account?{" "}
            <Link to="/login">Login</Link>
          </small>
        </div>
      </div>
    </div>
  </div>
</div>
  );
}

export default SignUpPage;
