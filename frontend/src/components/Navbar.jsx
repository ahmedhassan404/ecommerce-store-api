import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { userRole, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary" to="/">
          <i className="bi bi-shop me-2"></i>E-Shop
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/about">About</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">Contact</Link>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-3">
            {!userRole ? (
              <>
                <Link className="btn btn-outline-primary" to="/login">Login</Link>
                <Link className="btn btn-primary" to="/">Sign Up</Link>
              </>
            ) : (
              <>
                {userRole === 'customer' && (
                  <>
                    <Link className="nav-link" to="/home">Home</Link>
                    <Link className="nav-link position-relative" to="/cart">
                      <i className="bi bi-cart3 fs-5"></i>
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        0
                      </span>
                    </Link>
                  </>
                )}

                {userRole === 'seller' && (
                  <>
                    <Link className="nav-link" to="/seller-home">Seller Home</Link>
                    <Link className="nav-link" to="/product-analytics">Analytics</Link>
                  </>
                )}

                {userRole === 'admin' && (
                  <Link className="nav-link" to="/admin-dashboard">Admin Dashboard</Link>
                )}

                <button 
                  className="btn btn-outline-danger" 
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right me-1"></i>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
