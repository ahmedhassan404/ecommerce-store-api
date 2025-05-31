import { BrowserRouter, Route, Routes } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";

// Customer Pages
import CustomerHomePage from "./pages/customer/CustomerHomePage";
import ProductDetailPage from "./pages/customer/ProductDetailPage";
import CartPage from "./pages/customer/CartPage";
import CheckoutPage from "./pages/customer/CheckOutPage";
import PurchaseSuccessPage from './pages/customer/PurchaseSuccessPage';

// Seller Pages
import SellerHome from "./pages/seller/SellerHome";
import ProductAnalytics from "./pages/seller/ProductAnalytics";
import ProductDetailsPage from "./pages/seller/ProductDetailsPage";
import EditProductPage from "./pages/seller/EditProductPage";

// Admin Pages
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";

function App() {
    return ( <
        AuthProvider >
        <
        BrowserRouter >
        <
        div className = "App" >
        <
        Navbar / >
        <
        Routes > { /* Public */ } <
        Route path = "/"
        element = { < SignUpPage / > }
        /> <
        Route path = "/login"
        element = { < LoginPage / > }
        /> <
        Route path = "/about"
        element = { < AboutPage / > }
        /> <
        Route path = "/contact"
        element = { < ContactPage / > }
        />

        { /* Customer */ } <
        Route path = "/home"
        element = { <
            ProtectedRoute allowedRoles = {
                ['customer']
            } >
            <
            CustomerHomePage / >
            <
            /ProtectedRoute>
        }
        /> <
        Route path = "/products/:productId"
        element = { <
            ProtectedRoute allowedRoles = {
                ['customer']
            } >
            <
            ProductDetailPage / >
            <
            /ProtectedRoute>
        }
        /> <
        Route path = "/cart"
        element = { <
            ProtectedRoute allowedRoles = {
                ['customer']
            } >
            <
            CartPage / >
            <
            /ProtectedRoute>
        }
        /> <
        Route path = "/checkout"
        element = { <
            ProtectedRoute allowedRoles = {
                ['customer']
            } >
            <
            CheckoutPage / >
            <
            /ProtectedRoute>
        }
        /> <
        Route path = "/purchase-success"
        element = { <
            ProtectedRoute allowedRoles = {
                ['customer']
            } >
            <
            PurchaseSuccessPage / >
            <
            /ProtectedRoute>
        }
        />

        { /* Seller */ } <
        Route path = "/seller-home"
        element = { <
            ProtectedRoute allowedRoles = {
                ['seller']
            } >
            <
            SellerHome / >
            <
            /ProtectedRoute>
        }
        /> <
        Route path = "/product-analytics"
        element = { <
            ProtectedRoute allowedRoles = {
                ['seller']
            } >
            <
            ProductAnalytics / >
            <
            /ProtectedRoute>
        }
        /> <
        Route path = "/product-details/:productId"
        element = { <
            ProtectedRoute allowedRoles = {
                ['seller']
            } >
            <
            ProductDetailsPage / >
            <
            /ProtectedRoute>
        }
        /> <
        Route path = "/edit-product/:productId"
        element = { <
            ProtectedRoute allowedRoles = {
                ['seller']
            } >
            <
            EditProductPage / >
            <
            /ProtectedRoute>
        }
        />

        { /* Admin */ } <
        Route path = "/admin-dashboard"
        element = { <
            ProtectedRoute allowedRoles = {
                ['admin']
            } >
            <
            AdminDashboardPage / >
            <
            /ProtectedRoute>
        }
        /> < /
        Routes > <
        /div> < /
        BrowserRouter > <
        /AuthProvider>
    );
}

export default App;