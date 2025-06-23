import React, { useEffect, useState } from "react";
import axios from '../../utils/axios';
import "./AdminDashboardPagestyle.css"; // This now uses our improved CSS

function AdminDashboardPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [analytics, setAnalytics] = useState({
    users: 0,
    products: 0,
    totalSales: 0,
    totalRevenue: 0,
  });
  const [activeTab, setActiveTab] = useState("products");
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });

  const fetchProducts = () => {
    axios
      .get("http://localhost:5000/api/admin/products", { withCredentials: true })
      .then((res) => setProducts(res.data.data || []))
      .catch((err) => {
        console.error(err);
       
      });
  };

  const fetchCategories = () => {
    axios
      .get("http://localhost:5000/api/category", { withCredentials: true })
      .then((res) => setCategories(res.data.data || []))
      .catch((err) => {
        console.error(err);
        alert("Failed to fetch categories.");
      });
  };

  const fetchAnalytics = () => {
    axios
      .get("http://localhost:5000/api/analytics/dashboard", { withCredentials: true })
      .then((res) => {
        if (res.data.success) {
          setAnalytics(res.data.data);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to fetch analytics data.");
      });
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchAnalytics();
  }, []);

  const handleStatusUpdate = (productId, action) => {
    axios
      .patch(`http://localhost:5000/api/admin/products/${productId}/${action}`, {}, { withCredentials: true })
      .then((res) => {
        if (res.data.success) {
          setProducts((prev) => prev.filter((p) => p._id !== productId));
        } else {
          alert(`Failed to ${action} product.`);
        }
      })
      .catch((err) => {
        console.error(err);
        alert(`Failed to ${action} product.`);
      });
  };

  const handleDeleteCategory = (categoryId) => {
    axios
      .delete(`http://localhost:5000/api/category/${categoryId}`, { withCredentials: true })
      .then((res) => {
        if (res.data.success) {
          setCategories((prev) => prev.filter((cat) => cat._id !== categoryId));
        } else {
          alert("Failed to delete category.");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Error deleting category.");
      });
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategory.name.trim() || !newCategory.description.trim()) {
      alert("Both name and description are required.");
      return;
    }

    axios
      .post("http://localhost:5000/api/category/add", newCategory, { withCredentials: true })
      .then((res) => {
        if (res.data.success) {
          setCategories((prev) => [...prev, res.data.data]);
          setNewCategory({ name: "", description: "" });
        } 
      })
      .catch((err) => {
        console.error(err);
        alert("Error adding category.");
      });
  };

  const getStatusBadge = (status) => {
    const base = "badge";
    if (status === "approved") return <span className={`${base} bg-success`}>Approved</span>;
    if (status === "rejected") return <span className={`${base} bg-danger`}>Rejected</span>;
    return <span className={`${base} bg-warning`}>Pending</span>;
  };

  return (
    <div className="admin-dashboard-container">
      <h2 className="dashboard-title">Admin Dashboard</h2>

      {/* Dashboard Cards */}
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Pending Products</h3>
          <p>{products.filter((p) => !p.status || p.status === "pending").length}</p>
        </div>
        <div className="dashboard-card">
          <h3>Categories</h3>
          <p>{categories.length}</p>
        </div>
        <div className="dashboard-card">
          <h3>Revenue</h3>
          <p>${analytics.totalRevenue || 0}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="dashboard-tabs">
        <button className={`tab-button ${activeTab === "products" ? "active" : ""}`} onClick={() => setActiveTab("products")}>
          Pending Products
        </button>
        <button className={`tab-button ${activeTab === "categories" ? "active" : ""}`} onClick={() => setActiveTab("categories")}>
          Manage Categories
        </button>
        <button className={`tab-button ${activeTab === "analytics" ? "active" : ""}`} onClick={() => setActiveTab("analytics")}>
          Sellers Analytics
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "products" && (
          <div className="products-section">
            <h3>Pending Products</h3>
            {products.length === 0 ? (
              <p className="no-products">No pending products available</p>
            ) : (
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Seller</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>{product.name}</td>
                      <td>{product.sellerName || "N/A"}</td>
                      <td>{getStatusBadge(product.status)}</td>
                      <td className="action-buttons">
                        <button 
                          className="approve-btn" 
                          onClick={() => handleStatusUpdate(product._id, "approve")} 
                          disabled={product.status === "approved"}
                        >
                          Approve
                        </button>
                        <button 
                          className="reject-btn" 
                          onClick={() => handleStatusUpdate(product._id, "reject")} 
                          disabled={product.status === "rejected"}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === "categories" && (
          <div className="categories-section">
            <h3>Manage Categories</h3>

            <form className="add-category-form" onSubmit={handleAddCategory}>
              <input
                type="text"
                placeholder="Category Name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                required
              />
              <button type="submit">Add Category</button>
            </form>

            {categories.length === 0 ? (
              <p className="no-categories">No categories available</p>
            ) : (
              <ul className="categories-list">
                {categories.map((cat) => (
                  <li key={cat._id} className="category-item">
                    <div>
                      <strong>{cat.name}</strong>
                      <p>{cat.description}</p>
                    </div>
                    <button className="delete-btn" onClick={() => handleDeleteCategory(cat._id)}>
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="analytics-section">
            <h3>Sellers Analytics</h3>
            <div className="analytics-cards">
              <div className="analytics-card">
                <h4>Total Users</h4>
                <p>{analytics.users}</p>
              </div>
              <div className="analytics-card">
                <h4>Total Products</h4>
                <p>{analytics.products}</p>
              </div>
              <div className="analytics-card">
                <h4>Total Sales</h4>
                <p>{analytics.totalSales}</p>
              </div>
              <div className="analytics-card">
                <h4>Total Revenue</h4>
                <p>${analytics.totalRevenue}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboardPage;