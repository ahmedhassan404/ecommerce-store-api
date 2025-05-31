import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style/ProductDetailPage.css';

export default function ProductDetailPage() {
  const { productId } = useParams();  // Get productId from URL params
  const navigate = useNavigate();     // Hook for navigation
  const [product, setProduct] = useState(null);  // Store product details
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);      // Error message state
  const [quantity, setQuantity] = useState(1);   // Quantity user wants to add
  const [showSuccess, setShowSuccess] = useState(false);

  // Initialize carousel after component mounts
  useEffect(() => {
    const initCarousel = async () => {
      if (product?.images?.length > 0) {
        try {
          const bootstrap = await import('bootstrap');
          const carouselElement = document.getElementById('productCarousel');
          if (carouselElement) {
            new bootstrap.Carousel(carouselElement, {
              interval: false
            });
          }
        } catch (error) {
          console.error('Error initializing carousel:', error);
        }
      }
    };

    initCarousel();
  }, [product]);

  // Fetch product details on component mount or when productId changes
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/products/${productId}`, {
          withCredentials: true, // send cookies for authentication
        });
        if (res.data.success) {
          setProduct(res.data.data);
          setError(null);
        } else {
          setError('Failed to load product');
        }
      } catch (err) {
        console.error('Product fetch error:', err);
        setError(err.response?.data?.message || 'Error fetching product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  // Function to add product with quantity to cart
  const addToCart = async () => {
    if (!productId || !/^[0-9a-fA-F]{24}$/.test(productId)) {
      setError('Invalid product ID');
      return;
    }
    try {
      const response = await axios.post(
        'http://localhost:5000/api/cart/add',
        { productId, quantity },
        { withCredentials: true }
      );
      console.log('Add to cart response:', response.data);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/home'); // Redirect to home page after success
      }, 1500); // Reduced timeout to 1.5 seconds for better UX
      setError(null);
    } catch (err) {
      console.error('Add to cart error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Please log in to add items to your cart');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(err.response?.data?.message || 'Failed to add item to cart');
      }
    }
  };

  // Show loading spinner/message while fetching product
  if (loading) {
    return <div className="container py-5 text-center text-muted">Loading...</div>;
  }

  // Show error message if there's an error
  if (error) {
    return <div className="container py-5 text-center text-danger">{error}</div>;
  }

  // Show message if no product found
  if (!product) {
    return <div className="container py-5 text-center text-muted">Product not found</div>;
  }

  // Main UI: product details and add to cart functionality
  return (
    <div className="container py-4">
      {/* Success Toast */}
      <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 11 }}>
        <div className={`toast ${showSuccess ? 'show' : ''}`} role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-header bg-success text-white">
            <strong className="me-auto">Success!</strong>
            <button type="button" className="btn-close btn-close-white" onClick={() => setShowSuccess(false)}></button>
          </div>
          <div className="toast-body">
            Item added to cart successfully!
          </div>
        </div>
      </div>

      {/* Back button to previous page */}
      <button
        className="btn btn-secondary mb-4"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>
      
      <div className="row">
        {/* Left side: product image carousel */}
        <div className="col-md-6 mb-4">
          {product?.images?.length > 0 ? (
            <div id="productCarousel" className="carousel slide" data-bs-ride="false">
              {/* Carousel indicators */}
              <div className="carousel-indicators">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    data-bs-target="#productCarousel"
                    data-bs-slide-to={index}
                    className={index === 0 ? "active" : ""}
                    aria-current={index === 0 ? "true" : "false"}
                    aria-label={`Slide ${index + 1}`}
                  ></button>
                ))}
              </div>

              {/* Carousel items */}
              <div className="carousel-inner rounded">
                {product.images.map((img, index) => (
                  <div
                    key={index}
                    className={`carousel-item ${index === 0 ? "active" : ""}`}
                  >
                    <img
                      src={img.url}
                      className="d-block w-100"
                      alt={`${product.name} - Image ${index + 1}`}
                      style={{ height: '400px', objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </div>

              {/* Carousel controls */}
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#productCarousel"
                data-bs-slide="prev"
              >
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#productCarousel"
                data-bs-slide="next"
              >
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          ) : (
            <div className="d-flex align-items-center justify-content-center text-muted bg-light rounded" style={{ height: '400px' }}>
              No Image Available
            </div>
          )}
        </div>
        
        {/* Right side: product info and controls */}
        <div className="col-md-6">
          <h1 className="mb-3">{product.name}</h1>
          <p className="text-muted mb-4">{product.description || 'No description provided.'}</p>
          
          <div className="mb-3">
            <strong>Category:</strong> {product.category?.name || 'Unknown'}
          </div>
          
          <div className="h4 mb-4">
            Price: ${product.price?.toFixed(2) || 'N/A'}
          </div>
          
          {/* Quantity selector */}
          <div className="d-flex align-items-center mb-4">
            <label className="me-3 text-muted">Quantity:</label>
            <div className="btn-group">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="btn btn-outline-secondary"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="btn btn-light">{quantity}</span>
              <button
                onClick={() => setQuantity((prev) => prev + 1)}
                className="btn btn-outline-secondary"
              >
                +
              </button>
            </div>
          </div>
          
          {/* Add to cart button */}
          <button
            className="btn btn-primary w-100 py-2"
            onClick={addToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
