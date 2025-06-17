import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state || {};
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [errors, setErrors] = useState({});

  // Helper function to get product image URL
  const getProductImageUrl = (product) => {
    const imageField = product.image_url || product.image || product.thumbnail;
    if (imageField) {
      if (imageField.startsWith("/uploads/")) {
        return `http://localhost:5000${imageField}`;
      }
      return imageField;
    }
    return "https://via.placeholder.com/500x500/f5e6d3/5e3023?text=No+Image";
  };

  // Helper function to format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
    })
      .format(price)
      .replace("LKR", "Rs.");
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.cardNumber.trim())
      newErrors.cardNumber = "Card number is required";
    else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, "")))
      newErrors.cardNumber = "Card number must be 16 digits";
    if (!formData.expiry.trim()) newErrors.expiry = "Expiry date is required";
    else if (!/^\d{2}\/\d{2}$/.test(formData.expiry))
      newErrors.expiry = "Expiry must be MM/YY";
    if (!formData.cvv.trim()) newErrors.cvv = "CVV is required";
    else if (!/^\d{3}$/.test(formData.cvv))
      newErrors.cvv = "CVV must be 3 digits";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Payment submitted:", { order, formData });
      alert("Payment successful! Thank you for your order.");
      navigate("/"); // Redirect to home page after success
    }
  };

  if (!order || !order.product_id) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fff9f5]  ">
        <div className="text-center bg-white rounded-xl shadow-md border border-[#e7dcca] p-6 max-w-md  ">
          <svg
            className="mx-auto h-16 w-16 text-[#e7dcca] mb-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <h3 className="text-xl font-semibold text-[#5e3023] mb-2">
            No Order Found
          </h3>
          <p className="text-[#8c5f53]">
            Please select a product to proceed with payment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff9f5] py-12 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-[#e7dcca]">
        <div className="p-6 lg:p-10">
          <h1 className="text-3xl font-bold text-[#5e3023] mb-8">Checkout</h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="bg-[#f5e6d3] rounded-xl p-6">
              <h2 className="text-xl font-semibold text-[#5e3023] mb-4">
                Order Summary
              </h2>
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={getProductImageUrl(order)}
                  alt={order.name}
                  className="w-24 h-24 object-cover rounded-lg bg-[#f5f5f5]"
                  onError={(e) => {
                    console.error("Image failed to load:", e.target.src);
                    e.target.src =
                      "https://via.placeholder.com/500x500/f5e6d3/5e3023?text=No+Image";
                  }}
                />
                <div>
                  <h3 className="text-lg font-semibold text-[#5e3023]">
                    {order.name}
                  </h3>
                  <p className="text-[#8c5f53]">Quantity: {order.quantity}</p>
                  <p className="text-[#5e3023] font-bold">
                    {order.sale_price
                      ? formatPrice(order.sale_price * order.quantity)
                      : formatPrice(order.price * order.quantity)}
                  </p>
                </div>
              </div>
              <div className="border-t border-[#e7dcca] pt-4">
                <p className="text-[#8c5f53]">
                  <span className="font-medium">Subtotal:</span>{" "}
                  {order.sale_price
                    ? formatPrice(order.sale_price * order.quantity)
                    : formatPrice(order.price * order.quantity)}
                </p>
                <p className="text-[#8c5f53]">
                  <span className="font-medium">Shipping:</span>{" "}
                  {order.quantity * (order.sale_price || order.price) > 50
                    ? "Free"
                    : "Rs. 10"}
                </p>
                <p className="text-[#5e3023] font-bold mt-2">
                  <span className="font-medium">Total:</span>{" "}
                  {order.quantity * (order.sale_price || order.price) > 50
                    ? formatPrice(
                        order.sale_price
                          ? order.sale_price * order.quantity
                          : order.price * order.quantity
                      )
                    : formatPrice(
                        (order.sale_price
                          ? order.sale_price * order.quantity
                          : order.price * order.quantity) + 10
                      )}
                </p>
              </div>
            </div>

            {/* Payment Form */}
            <div>
              <h2 className="text-xl font-semibold text-[#5e3023] mb-4">
                Payment Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#5e3023] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-[#e7dcca] focus:outline-none focus:ring-2 focus:ring-[#d3756b] text-[#5e3023]"
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#5e3023] mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-[#e7dcca] focus:outline-none focus:ring-2 focus:ring-[#d3756b] text-[#5e3023]"
                    placeholder="john.doe@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#5e3023] mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-[#e7dcca] focus:outline-none focus:ring-2 focus:ring-[#d3756b] text-[#5e3023]"
                    placeholder="123 Sweet St, Bakery City"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#5e3023] mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-[#e7dcca] focus:outline-none focus:ring-2 focus:ring-[#d3756b] text-[#5e3023]"
                    placeholder="1234 5678 9012 3456"
                  />
                  {errors.cardNumber && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.cardNumber}
                    </p>
                  )}
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-[#5e3023] mb-1">
                      Expiry (MM/YY)
                    </label>
                    <input
                      type="text"
                      name="expiry"
                      value={formData.expiry}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-[#e7dcca] focus:outline-none focus:ring-2 focus:ring-[#d3756b] text-[#5e3023]"
                      placeholder="12/25"
                    />
                    {errors.expiry && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.expiry}
                      </p>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-[#5e3023] mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-[#e7dcca] focus:outline-none focus:ring-2 focus:ring-[#d3756b] text-[#5e3023]"
                      placeholder="123"
                    />
                    {errors.cvv && (
                      <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleSubmit}
                  className="w-full bg-[#5e3023] text-white py-3 rounded-lg hover:bg-[#4a241b] transition-colors font-medium text-sm sm:text-base"
                >
                  Complete Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
