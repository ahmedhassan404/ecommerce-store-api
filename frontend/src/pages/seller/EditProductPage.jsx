import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from '../../utils/axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/EditProductPage.css';

const EditProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/products/${productId}`, {
          withCredentials: true,
        });
        const { name, description, price, stock, category, images } = response.data.data;
        setFormData({ name, description, price, stock, category: category._id });
        setExistingImages(images || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch product.");
      } finally {
        setIsFetching(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/category", {
          withCredentials: true,
        });
        setCategories(response.data.data);
      } catch (err) {
        setError("Failed to fetch categories.");
      }
    };

    fetchProduct();
    fetchCategories();
  }, [productId]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + existingImages.length > 5) {
      setError(`You can only upload a maximum of 5 images. You already have ${existingImages.length} images.`);
      return;
    }

    const validTypes = ["image/jpeg", "image/png"];
    const invalidFiles = files.filter((file) => !validTypes.includes(file.type));
    if (invalidFiles.length > 0) {
      setError("Only JPEG and PNG images are allowed.");
      return;
    }

    setImages(files);
    const newImagePreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviewUrls(newImagePreviews);
  };

  const handleRemoveExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveNewImage = (index) => {
    const updatedImages = [...images];
    const updatedPreviews = [...imagePreviewUrls];
    URL.revokeObjectURL(updatedPreviews[index]);
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setImages(updatedImages);
    setImagePreviewUrls(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (formData.price < 0 || isNaN(formData.price)) {
      setError("Price must be a positive number.");
      setIsLoading(false);
      return;
    }
    if (formData.stock < 0 || isNaN(formData.stock)) {
      setError("Stock must be a non-negative number.");
      setIsLoading(false);
      return;
    }

    try {
      const productFormData = new FormData();
      for (const key in formData) {
        productFormData.append(key, formData[key]);
      }
      images.forEach((image) => {
        productFormData.append("images", image);
      });
      if (existingImages.length > 0) {
        productFormData.append("existingImages", JSON.stringify(existingImages));
      }

      await axios.patch(
        `/api/products/${productId}`,
        productFormData,
        { withCredentials: true }
      );

      alert("Product updated successfully!");
      navigate(`/product-details/${productId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Error updating product.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviewUrls]);

  if (isFetching) {
    return <div className="container py-5 text-center text-muted">Loading product...</div>;
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Edit Product</h2>
              
              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    className="form-control"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
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
                      value={formData.price}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Stock</label>
                    <input
                      type="number"
                      name="stock"
                      className="form-control"
                      value={formData.stock}
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
                    value={formData.category}
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
                  <label className="form-label">Product Images</label>
                  
                  {existingImages.length > 0 && (
                    <div className="mb-3">
                      <h5>Current Images</h5>
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        {existingImages.map((img, index) => (
                          <div key={index} className="position-relative" style={{ width: '100px' }}>
                            <img
                              src={img.url}
                              alt={`Product ${index + 1}`}
                              className="img-thumbnail"
                            />
                            <button
                              type="button"
                              className="btn btn-danger btn-sm position-absolute top-0 end-0"
                              onClick={() => handleRemoveExistingImage(index)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mb-3">
                    <label htmlFor="images" className="form-label">
                      Add New Images (Max {5 - existingImages.length})
                    </label>
                    <input
                      type="file"
                      id="images"
                      name="images"
                      className="form-control"
                      onChange={handleImageChange}
                      multiple
                      accept="image/jpeg,image/png"
                    />
                  </div>

                  {imagePreviewUrls.length > 0 && (
                    <div className="mb-3">
                      <h5>New Image Previews</h5>
                      <div className="d-flex flex-wrap gap-2">
                        {imagePreviewUrls.map((url, index) => (
                          <div key={index} className="position-relative" style={{ width: '100px' }}>
                            <img src={url} alt={`New upload ${index + 1}`} className="img-thumbnail" />
                            <button
                              type="button"
                              className="btn btn-danger btn-sm position-absolute top-0 end-0"
                              onClick={() => handleRemoveNewImage(index)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button
                    type="button"
                    className="btn btn-secondary me-md-2"
                    onClick={() => navigate(`/product-details/${productId}`)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? "Updating..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductPage;