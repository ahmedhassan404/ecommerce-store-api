import { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style/CustomerHomePage.css';

export default function CustomerHomePage() {
  // Store list of products from API
  const [products, setProducts] = useState([]);
  // Store list of product categories from API
  const [categories, setCategories] = useState([]);
  // Which category is currently selected, default to 'ALL'
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  // Loading state for product data
  const [loading, setLoading] = useState(true);
  // Error message if something fails
  const [error, setError] = useState(null);
  // Navigation hook for routing
  const navigate = useNavigate();

  // Fetch categories from backend API
  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/category');
      if (res.data.success && Array.isArray(res.data.data)) {
        setCategories(res.data.data);
      } else {
        console.error('Invalid category data format:', res.data);
        setError('Failed to load categories - invalid data format');
      }
    } catch (err) {
      console.error('Category fetch error:', err);
      setError('Failed to load categories. Please try again later.');
    }
  };

  // Fetch products, either all or filtered by category
  const fetchProducts = async (categoryId = 'ALL') => {
    try {
      setLoading(true); // show loading spinner
      let res;
      if (categoryId === 'ALL') {
        // Get all products
        res = await axios.get('/api/products', {
          withCredentials: true,
        });
        console.log('Products data:', res.data.data);
        setProducts(res.data.data || []);
      } else {
        // Get products by category id
        res = await axios.get(`/api/category/${categoryId}`, {
          withCredentials: true,
        });
        console.log('Category products data:', res.data.data);
        setProducts(res.data.data || []);
      }
      setLoading(false); // done loading
    } catch (err) {
      // Log and show error if fetching products fails
      console.error('Product fetch error:', err);
      setError('Failed to load products');
      setLoading(false);
    }
  };
  
  // When component mounts, load categories and all products
  useEffect(() => {
    const loadData = async () => {
      await fetchCategories();
      await fetchProducts();
    };
    loadData();
  }, []);

  // When selectedCategory changes, fetch products for that category
  useEffect(() => {
    if (selectedCategory) {
      fetchProducts(selectedCategory);
    }
  }, [selectedCategory]);

  // Change selected category when user clicks category button
  const handleCategoryClick = (id) => {
    setSelectedCategory(id);
  };

  // Navigate to product details page when clicking "View Product"
  const viewProduct = (productId) => {
    navigate(`/products/${productId}`);
  };

  return (
    <div className="container-fluid py-4">
      {/* Category filter buttons */}
      <div className="row mb-4">
        <div className="col-12">
          <nav className="d-flex flex-wrap gap-2">
            <button
              type="button"
              className={`btn ${selectedCategory === 'ALL' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => handleCategoryClick('ALL')}
            >
              ALL
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                type="button"
                className={`btn ${selectedCategory === cat._id ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => handleCategoryClick(cat._id)}
              >
                {cat.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Products grid */}
      <div className="row g-4">
        {loading ? (
          <div className="col-12 text-center text-muted py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="col-12 text-center text-danger py-5">{error}</div>
        ) : products.length === 0 ? (
          <div className="col-12 text-center text-muted py-5">No products available</div>
        ) : (
          products.map((product) => (
            <div key={product._id} className="col-md-4 col-lg-3">
              <div className="card h-100 product-card border-0 shadow-sm hover-shadow transition-all">
                <div className="position-relative">
                  <img
                    src={product.images?.length > 0 ? product.images[0].url : '/placeholder.jpg'}
                    alt={product.name}
                    className="card-img-top product-image"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <div className="position-absolute top-0 end-0 p-2">
                    <span className="badge bg-primary rounded-pill">
                      {product.category?.name || 'Unknown'}
                    </span>
                  </div>
                </div>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-truncate">{product.name}</h5>
                  <p className="card-text text-muted small flex-grow-1">
                    {product.description?.substring(0, 100)}...
                  </p>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <h4 className="mb-0 text-primary">${product.price?.toFixed(2) || 'N/A'}</h4>
                    <button
                      onClick={() => viewProduct(product._id)}
                      className="btn btn-primary"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
