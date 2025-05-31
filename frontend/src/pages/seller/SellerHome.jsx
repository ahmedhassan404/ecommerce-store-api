import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/SellerHome.css';

function SellerHome() {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    images: [],
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/category", {
          withCredentials: true,
        });
        const validCategories = response.data.data.filter(cat => cat._id && cat.name);
        setCategories(validCategories);
        if (validCategories.length === 0) {
          setError("No categories available. Please contact an admin to add categories.");
        }
      } catch (err) {
        setError("Failed to fetch categories. Please try again.");
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setProduct((prevState) => ({
      ...prevState,
      images: files,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!product.name) {
      setError("Product name is required.");
      return;
    }
    if (!product.description) {
      setError("Description is required.");
      return;
    }
    if (!product.price || product.price <= 0) {
      setError("Please enter a valid price greater than 0.");
      return;
    }
    if (!product.stock || product.stock < 0) {
      setError("Please enter a valid stock quantity (0 or more).");
      return;
    }
    if (!product.category) {
      setError("Please select a category.");
      return;
    }
    if (product.images.length === 0) {
      setError("At least one image is required.");
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    for (let i = 0; i < product.images.length; i++) {
      if (!allowedTypes.includes(product.images[i].type)) {
        setError("Only JPEG, PNG, and JPG images are allowed.");
        return;
      }
    }

    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price);
    formData.append('stock', product.stock);
    
    const selectedCategory = categories.find(cat => cat._id === product.category);
    if (selectedCategory) {
      formData.append('category', selectedCategory.name);
    } else {
      setError("Selected category is invalid. Please choose a valid category.");
      return;
    }

    product.images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      const response = await axios.post(
        "http://localhost:5000/api/products",
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setSuccess("Product added successfully!");
      setProduct({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        images: [],
      });
      document.querySelector('input[type="file"]').value = null;
    } catch (error) {
      console.error("Error adding product:", error);
      setError(error.response?.data?.message || "Failed to add product. Please try again.");
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Welcome, Seller</h2>
        <Link to="/product-analytics" className="btn btn-outline-primary">
          View Analytics
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow">
              <div className="card-body">
                <h4 className="card-title text-center mb-4">Add Product</h4>
                
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Product Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={product.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      name="description"
                      className="form-control"
                      value={product.description}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Price</label>
                      <input
                        type="number"
                        name="price"
                        className="form-control"
                        value={product.price}
                        onChange={handleChange}
                        min="0.01"
                        step="0.01"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Stock</label>
                      <input
                        type="number"
                        name="stock"
                        className="form-control"
                        value={product.stock}
                        onChange={handleChange}
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select
                      name="category"
                      className="form-select"
                      value={product.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Images</label>
                    <input
                      type="file"
                      name="images"
                      className="form-control"
                      onChange={handleImageChange}
                      multiple
                      accept="image/jpeg,image/png,image/jpg"
                      required
                    />
                  </div>

                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={categories.length === 0 || loading}
                    >
                      Add Product
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SellerHome;