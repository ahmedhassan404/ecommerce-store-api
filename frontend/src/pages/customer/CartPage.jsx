import { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style/CartPage.css';

export default function CartPage() {
  // State to store the list of items in the cart
  const [cartItems, setCartItems] = useState([]);
  // State to track if data is loading
  const [loading, setLoading] = useState(true);
  // State to track if there's any error
  const [error, setError] = useState(null);

  // To navigate between pages
  const navigate = useNavigate();

  // Function to get cart items from server
  const fetchCartItems = async () => {
    try {
      setLoading(true);  // Show loading message
      // Call backend to get cart items, include cookies for user session
      const res = await axios.get('http://localhost:5000/api/cart/products', {
        withCredentials: true,
      });
      // Save received cart data, or empty list if none
      setCartItems(res.data.cart || []);
      setError(null);    // Clear any previous errors
      setLoading(false); // Loading done
    } catch (err) {
      // If error happens, show error message
      console.error('Cart fetch error:', err);
      setError('Failed to load cart items');
      setLoading(false);
    }
  };

  // Change the quantity of a product in cart
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return; // Don't allow quantity less than 1
    try {
      // Send updated quantity to server
      const response = await axios.put(
        'http://localhost:5000/api/cart/product',
        { productId, quantity: newQuantity },
        { withCredentials: true }
      );
      setError(null);    // Clear error if any
      fetchCartItems();  // Refresh cart data
    } catch (err) {
      console.error('Update quantity error:', err);
      setError(err.response?.data?.message || 'Failed to update quantity');
    }
  };

  // Remove an item from the cart
  const removeItem = async (productId) => {
    try {
      // Tell server to remove this product from cart
      await axios.delete('http://localhost:5000/api/cart/product', {
        data: { productId },
        withCredentials: true,
      });
      setError(null);
      fetchCartItems();  // Refresh cart after removal
    } catch (err) {
      console.error('Remove item error:', err);
      setError('Failed to remove item');
    }
  };

  // Remove all items from the cart (clear it)
  const clearCart = async () => {
    try {
      // Tell server to clear entire cart
      await axios.delete('http://localhost:5000/api/cart', {
        withCredentials: true,
      });
      setError(null);
      fetchCartItems();  // Refresh cart to show empty
    } catch (err) {
      console.error('Clear cart error:', err);
      setError('Failed to clear cart');
    }
  };

  // Run once when component loads to get cart items
  useEffect(() => {
    fetchCartItems();
  }, []);

  // Show loading message while data is being fetched
  if (loading) return <div className="container py-5 text-center text-muted">Loading cart...</div>;
  // Show error message if something went wrong
  if (error) return <div className="container py-5 text-center text-danger">{error}</div>;

  // Filter cart items to only show ones with valid data
  const validCartItems = cartItems.filter(item => {
    if (
      !item.productId ||               // Must have product ID
      typeof item.price !== 'number' || // Price must be a number
      typeof item.quantity !== 'number' || // Quantity must be a number
      item.quantity <= 0 ||            // Quantity must be at least 1
      !item.name ||                   // Must have a name
      !item.image                    // Must have an image
    ) {
      console.warn('Invalid cart item:', item); // Warn about bad item
      return false;
    }
    return true;
  });

  // Calculate total price of valid items in cart
  const total = validCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="container py-4">
      <h1 className="mb-4">Your Cart</h1>

      {/* Warning if some items are invalid */}
      {cartItems.length > 0 && validCartItems.length < cartItems.length && (
        <div className="alert alert-warning mb-4" role="alert">
          Some items could not be displayed due to missing or invalid data.
          <br />
          Please refresh the cart or remove all invalid items.
        </div>
      )}

      {/* Show message if cart is empty */}
      {validCartItems.length === 0 ? (
        <div className="text-center py-5">
          <p className="mb-4">Your cart is empty</p>
          <button className="btn btn-primary" onClick={() => navigate('/home')}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          {/* Show each valid item in cart */}
          <div className="cart-items mb-4">
            {validCartItems.map((item) => (
              <div key={item.productId} className="card mb-3">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-md-2">
                      {/* Product image */}
                      <img src={item.image} alt={item.name} className="img-fluid rounded cart-item-image" />
                    </div>
                    <div className="col-md-4">
                      {/* Product name and price */}
                      <h5 className="card-title">{item.name}</h5>
                      <p className="text-muted">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="col-md-3">
                      {/* Buttons to change quantity */}
                      <div className="input-group">
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1} // Disable if quantity is 1
                        >
                          -
                        </button>
                        <input
                          type="text"
                          className="form-control text-center"
                          value={item.quantity}
                          readOnly
                        />
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="col-md-2 text-end">
                      {/* Total price for this product */}
                      <p className="h5">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <div className="col-md-1 text-end">
                      {/* Button to remove item */}
                      <button
                        className="btn btn-link text-danger"
                        onClick={() => removeItem(item.productId)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart summary and actions */}
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">Total:</h4>
                <h4 className="mb-0">${total.toFixed(2)}</h4>
              </div>

              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                {/* Clear entire cart */}
                <button className="btn btn-outline-danger me-md-2" onClick={clearCart}>
                  Clear Cart
                </button>
                {/* Refresh cart data */}
                <button className="btn btn-secondary me-md-2" onClick={fetchCartItems}>
                  Refresh Cart
                </button>
                {/* Go to checkout, disabled if cart is empty */}
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/checkout')}
                  disabled={validCartItems.length === 0}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
