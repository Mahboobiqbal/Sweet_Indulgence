import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./Components/Home";
import Navbar from "./Components/Navbar";
import LoginPage from "./Components/Login";
import SignUpPage from "./Components/Signup";
import StoreCreationPage from "./Components/StoreCreationpage";
import AboutPage from "./Components/About";
import ContactPage from "./Components/Contact";
import StoreDetailsPage from "./Components/Storedetailspage";
import Footer from "./Components/Footer";
import Dashboard from "./Components/Dashboard";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/store/:id" element={<StoreDetailsPage />} />
        
        {/* Protected Routes */}
        <Route 
          path="/create-store" 
          element={
            <ProtectedRoute allowedRoles={['supplier', 'admin']}>
              <StoreCreationPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/supplier-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['supplier', 'admin']}>
              <div>Supplier Dashboard Coming Soon...</div>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <div>User Profile Coming Soon...</div>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <Dashboard />
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
