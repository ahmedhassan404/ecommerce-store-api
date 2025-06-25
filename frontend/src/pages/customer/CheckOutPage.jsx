import { useState, useEffect } from "react";
import axios from '../../utils/axios';
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './style/CheckOutPage.css';

export default function CheckoutPage() {
  // State to hold cart items from backend
  const [cartItems, setCartItems] = useState([]);
  // Loading state to show loading message while fetching
  const [loading, setLoading] = useState(true);
  // To show any error messages
  const [error, setError] = useState(null);
  // To track if the checkout is in progress
  const [processing, setProcessing] = useState(false);
  // Hook to navigate between pages
  const navigate = useNavigate();

  // When the component loads, get cart items from backend
  useEffect(() => {
    axios
      .get("/api/cart/products", { withCredentials: true })
      .then(({ data }) => {
        // Save cart items, or empty if none
        setCartItems(data.cart || []);
        // Done loading now
        setLoading(false);
      })
      .catch((err) => {
        // Show error if something goes wrong
        console.error("Cart fetch error:", err.message);
        setError("Failed to load cart.");
        setLoading(false);
      });
  }, []);

  // Function to handle checkout button click
  const handleCheckout = async () => {
    // Show processing state and clear previous errors
    setProcessing(true);
    setError(null);

    // Keep only valid items (those with good data)
    const validItems = cartItems.filter(
      (item) =>
        item.productId &&
        typeof item.price === "number" &&
        item.price > 0 &&
        typeof item.quantity === "number" &&
        item.quantity > 0
    );

    // If no valid items, show error and stop
    if (validItems.length === 0) {
      setError("No valid items in cart.");
      setProcessing(false);
      return;
    }

    try {
      // Prepare products for sending to server
      const products = validItems.map((item) => ({
        product: item.productId,
        quantity: item.quantity,
        price: item.price,
      }));

      // Calculate total price of all items
      const totalAmount = products.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // Create order
      await axios.post(
        "/api/payment/create",
        { products, totalAmount },
        { withCredentials: true }
      );

      // Clear cart after successful order
      await axios.delete('/api/cart', {
        withCredentials: true,
      });

      // On success, go to purchase success page
      navigate(`/purchase-success`);
    } catch (err) {
      // If error, show message and stop processing
      console.error("Order creation error:", err);
      setError(err.response?.data?.message || "Failed to create order.");
      setProcessing(false);
    }
  };

  // Show loading message if data is still loading
  if (loading) return <div className="container py-5 text-center text-muted">Loading...</div>;

  // Show error message if there is any error
  if (error) return <div className="container py-5 text-center text-danger">{error}</div>;

  // Filter cart to keep only valid items before showing
  const validItems = cartItems.filter(
    (item) =>
      item.productId &&
      typeof item.price === "number" &&
      item.price > 0 &&
      typeof item.quantity === "number" &&
      item.quantity > 0
  );

  // Calculate total amount for valid items
  const total = validItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container py-4">
      <h1 className="mb-4">Checkout</h1>

      {/* Show warning if some items are invalid */}
      {validItems.length < cartItems.length && cartItems.length > 0 && (
        <div className="alert alert-warning mb-4">
          Some cart items are invalid and have been removed from checkout.
        </div>
      )}

      <div className="card mb-4">
        <div className="card-body">
          <h2 className="card-title mb-4">Order Summary</h2>

          {/* If no valid items, show message */}
          {validItems.length === 0 ? (
            <p className="text-muted">No items in cart</p>
          ) : (
            <>
              {/* List each valid item with name, quantity, and price */}
              <div className="list-group mb-3">
                {validItems.map((item) => (
                  <div key={item.productId} className="list-group-item">
                    <div className="d-flex justify-content-between">
                      <span>
                        {item.name} (x{item.quantity})
                      </span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Show total price */}
              <div className="d-flex justify-content-between fw-bold fs-5">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Buttons for placing order and going back */}
      <div className="d-grid gap-3">
        <button
          onClick={handleCheckout}
          disabled={processing || !validItems.length}
          className={`btn ${processing || !validItems.length ? "btn-secondary" : "btn-primary"} btn-lg`}
        >
          {/* Show "Processing..." if waiting */}
          {processing ? "Processing..." : "Place Order"}
        </button>

        <button
          onClick={() => navigate("/cart")}
          className="btn btn-outline-secondary"
        >
          Back to Cart
        </button>
      </div>
    </div>
  );
}
