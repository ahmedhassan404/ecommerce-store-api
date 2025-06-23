import React, { useState, useEffect } from "react";
import axios from '../../utils/axios';
import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/ProductAnalytics.css';

function ProductAnalytics() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/seller/products", {
          withCredentials: true,
        });
        setProducts(response.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(error.response?.data?.message || "Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Product Analytics</h1>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/seller-home')}
        >
          Add New Product
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.description.substring(0, 50)}...</td>
                  <td>${product.price}</td>
                  <td>{product.stock}</td>
                  <td>{product.category?.name || 'N/A'}</td>
                  <td>
                    <Link to={`/product-details/${product._id}`} className="btn btn-sm btn-outline-primary">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProductAnalytics;