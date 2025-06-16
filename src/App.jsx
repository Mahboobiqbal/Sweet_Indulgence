import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./Components/Home";
import Navbar from "./Components/Navbar";
import LoginPage from "./Components/Login";
import SignUpPage from "./Components/Signup";
import StoreCreationPage from "./Components/StoreCreationpage";
import AboutPage from "./Components/About";
import ContactPage from "./Components/Contact";
import StoreDetailsPage from "./Components/Storedetailspage";
import Footer from "./Components/Footer";
import SupplierDashboard from "./Components/SupplierDashboard";
import AddProduct from "./Components/AddProduct";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProductsPage from "./Components/ProductsPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfilePage from "./Components/profile";
import StoreSettingsPage from "./Components/storeSettingPage";
import OrdersPage from "./Components/OrdersPage";
import HomePage from "./Components/HomPage";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { currentUser, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

// App Routes Component (Wrapped by AuthProvider)
const AppRoutes = () => {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/store/:id" element={<StoreDetailsPage />} />

        <Route path="/store-settings" element={<StoreSettingsPage />} />
        <Route path="/manage-orders" element={<OrdersPage />} />

        {/* Protected Routes */}
        <Route
          path="/create-store"
          element={
            <ProtectedRoute allowedRoles={["supplier", "admin"]}>
              <StoreCreationPage />
            </ProtectedRoute>
          }
        />
        <Route path="/profile" element={<ProfilePage />} />
        <Route
          path="/add-product"
          element={
            <ProtectedRoute allowedRoles={["supplier", "admin"]}>
              <AddProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-products"
          element={
            <ProtectedRoute>
              <ProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplier-dashboard"
          element={
            <ProtectedRoute>
              <SupplierDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
      <ToastContainer />
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;
