import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Components/Home";
import Navbar from "./Components/Navbar";
import LoginPage from "./Components/Login";
import SignUpPage from "./Components/Signup";
import StoreCreationPage from "./Components/StoreCreationpage";
import AboutPage from "./Components/About";
import ContactUsPage from "./Components/ContactUs";
import StoreDetailsPage from "./Components/Storedetailspage";
import Footer from "./Components/Footer";
const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactUsPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/create-store" element={<StoreCreationPage />} />
        <Route path="/home" element={<div>Home Page Coming Soon...</div>} />
        <Route path="/store/:id" element={<StoreDetailsPage />} />
        <Route
          path="/supplier-dashboard"
          element={<div>Supplier Dashboard Coming Soon...</div>}
        />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
