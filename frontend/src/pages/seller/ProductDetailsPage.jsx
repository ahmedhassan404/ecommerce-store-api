import React, { useState, useEffect } from "react";
import axios from '../../utils/axios';
import { useNavigate, useParams } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/ProductDetailsPage.css';

const ProductDetailsPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [orderCount, setOrderCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleDeleteProduct = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${productId}`, {
          withCredentials: true,
        });
        alert("Product deleted successfully!");
        navigate('/product-analytics');
      } catch (error) {
        console.error("Error deleting product:", error);
        alert(error.response?.data?.message || "Failed to delete product.");
      }
    }
  };

  const handleEditProduct = () => {
    navigate(`/edit-product/${productId}`);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        
        const response = await axios.get(`http://localhost:5000/api/seller/products`, {
          withCredentials: true,
        });
        
        const foundProduct = response.data.data.find(prod => prod._id === productId);
        
        if (!foundProduct) {
          setError("Product not found or you don't have permission to view it.");
          setLoading(false);
          return;
        }
        
        setProduct(foundProduct);
        setOrderCount(foundProduct.orderCount || 0);
        
      } catch (error) {
        console.error("Error fetching product:", error);
        setError(error.response?.data?.message || "Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) return (
    <div className="container py-5 text-center">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (error) return <div className="container py-5 alert alert-danger">{error}</div>;
  if (!product) return <div className="container py-5 alert alert-warning">No product found</div>;

  return (
    <div className="container py-4">
      <div className="card shadow">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="card-title">{product.name}</h1>
            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate('/product-analytics')}
            >
              ← Back to Analytics
            </button>
          </div>

          <div className="row">
            <div className="col-md-6 mb-4">
              {product.images && product.images.length > 0 ? (
                <div className="d-flex flex-wrap gap-2">
                  {product.images.map((img, i) => (
                    <img
                      key={i} 
                      src={img.url} 
                      alt={`${product.name} - Image ${i+1}`} 
                      className="img-fluid rounded product-image"
                      style={{ maxHeight: '300px', objectFit: 'cover' }}
                    />
                  ))}
                </div>
              ) : (
                <div className="alert alert-info">No images available</div>
              )}
            </div>

            <div className="col-md-6">
              <div className="mb-4">
                <h4>Description</h4>
                <p>{product.description}</p>
              </div>

              <div className="row mb-4">
                <div className="col-md-6">
                  <h5>Price</h5>
                  <p>${parseFloat(product.price).toFixed(2)}</p>
                </div>
                <div className="col-md-6">
                  <h5>Stock</h5>
                  <p>{product.stock}</p>
                </div>
                <div className="col-md-6">
                  <h5>Category</h5>
                  <p>{product.category?.name || 'N/A'}</p>
                </div>
                <div className="col-md-6">
                  <h5>Status</h5>
                  <p className={`badge bg-${product.status === 'active' ? 'success' : 'warning'}`}>
                    {product.status}
                  </p>
                </div>
                <div className="col-md-6">
                  <h5>Orders</h5>
                  <p>{orderCount}</p>
                </div>
              </div>

              <div className="d-grid gap-2 d-md-flex">
                <button 
                  className="btn btn-primary me-md-2"
                  onClick={handleEditProduct}
                >
                  Edit Product
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={handleDeleteProduct}
                >
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;