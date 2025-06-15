import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: "John Doe",
    bio: "A passionate software engineer with a love for clean code.",
    avatar: "/default-avatar.png",
    address: "1234 Code Street, DevCity, 56789",
    phone: "+1 (555) 123-4567",
    email: "john.doe@example.com",
    billingAddress: "1234 Code Street, DevCity, 56789",
    cardNumber: "**** **** **** 4242",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSave = () => {
    const newErrors = {};
    if (!profile.name.trim()) newErrors.name = "Name is required";
    if (!profile.phone.trim()) newErrors.phone = "Phone is required";
    if (!profile.address.trim()) newErrors.address = "Address is required";
    if (!profile.billingAddress.trim())
      newErrors.billingAddress = "Billing Address is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please correct the errors before saving");
      return;
    }
    toast.success("Profile updated successfully");
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 ">
      <ToastContainer />
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden mt-10 ">
        <div className="grid md:grid-cols-2 gap-6 p-8">
          {/* Profile Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
            <div className="flex items-center gap-4 mb-4">
              <img
                src={profile.avatar}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500"
              />
              {isEditing && (
                <input
                  type="text"
                  name="avatar"
                  value={profile.avatar}
                  onChange={handleChange}
                  className="border px-3 py-2 rounded w-full"
                  placeholder="Avatar Image URL"
                />
              )}
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 rounded border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">Bio</label>
              <textarea
                name="bio"
                rows="3"
                value={profile.bio}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 rounded border border-gray-300"
              />
            </div>
          </div>

          {/* Contact Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <div className="mb-4">
              <label className="block font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                disabled
                className="w-full px-4 py-2 rounded border border-gray-300 bg-gray-100 text-gray-600"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 rounded border ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={profile.address}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 rounded border ${
                  errors.address ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address}</p>
              )}
            </div>
          </div>

          {/* Billing Section */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-semibold mb-4">Billing Information</h2>
            <div className="mb-4">
              <label className="block font-medium mb-1">Card Number</label>
              <input
                type="text"
                name="cardNumber"
                value={profile.cardNumber}
                disabled={!isEditing}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded border border-gray-300"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Billing Address</label>
              <input
                type="text"
                name="billingAddress"
                value={profile.billingAddress}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 rounded border ${
                  errors.billingAddress ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.billingAddress && (
                <p className="text-red-500 text-sm">{errors.billingAddress}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="md:col-span-2 flex justify-end gap-4 mt-6">
            {isEditing ? (
              <>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setErrors({});
                  }}
                  className="px-6 py-2 bg-gray-300 hover:bg-gray-400 rounded font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded font-semibold"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded font-semibold"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
