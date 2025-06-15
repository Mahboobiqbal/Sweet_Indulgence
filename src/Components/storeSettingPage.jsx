import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StoreSettingsPage = () => {
  const [store, setStore] = useState({
    storeName: "My Online Store",
    description: "A one-stop shop for all your needs.",
    contactEmail: "store@example.com",
    contactPhone: "+1 (555) 987-6543",
    address: "5678 Market Street, ShopCity, 12345",
    businessHours: {
      Monday: "9:00 AM - 5:00 PM",
      Tuesday: "9:00 AM - 5:00 PM",
      Wednesday: "9:00 AM - 5:00 PM",
      Thursday: "9:00 AM - 5:00 PM",
      Friday: "9:00 AM - 5:00 PM",
      Saturday: "10:00 AM - 3:00 PM",
      Sunday: "Closed",
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("businessHours.")) {
      const day = name.split(".")[1];
      setStore((prev) => ({
        ...prev,
        businessHours: { ...prev.businessHours, [day]: value },
      }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    } else {
      setStore((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSave = () => {
    const newErrors = {};
    if (!store.storeName.trim()) newErrors.storeName = "Store name is required";
    if (!store.contactPhone.trim())
      newErrors.contactPhone = "Phone is required";
    if (!store.address.trim()) newErrors.address = "Address is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please correct the errors before saving");
      return;
    }
    toast.success("Store settings updated successfully");
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <ToastContainer />
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden mt-10">
        <div className="grid md:grid-cols-2 gap-6 p-8">
          {/* Store Information */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Store Information</h2>
            <div className="mb-4">
              <label className="block font-medium mb-1">Store Name</label>
              <input
                type="text"
                name="storeName"
                value={store.storeName}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 rounded border ${
                  errors.storeName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.storeName && (
                <p className="text-red-500 text-sm">{errors.storeName}</p>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">Description</label>
              <textarea
                name="description"
                rows="3"
                value={store.description}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 rounded border border-gray-300"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <div className="mb-4">
              <label className="block font-medium mb-1">Contact Email</label>
              <input
                type="email"
                name="contactEmail"
                value={store.contactEmail}
                disabled
                className="w-full px-4 py-2 rounded border border-gray-300 bg-gray-100 text-gray-600"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-1">Contact Phone</label>
              <input
                type="text"
                name="contactPhone"
                value={store.contactPhone}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 rounded border ${
                  errors.contactPhone ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.contactPhone && (
                <p className="text-red-500 text-sm">{errors.contactPhone}</p>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={store.address}
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

          {/* Business Hours */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-semibold mb-4">Business Hours</h2>
            {Object.keys(store.businessHours).map((day) => (
              <div key={day} className="mb-4">
                <label className="block font-medium mb-1">{day}</label>
                <input
                  type="text"
                  name={`businessHours.${day}`}
                  value={store.businessHours[day]}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 rounded border border-gray-300"
                  placeholder="e.g., 9:00 AM - 5:00 PM or Closed"
                />
              </div>
            ))}
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
                Edit Settings
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreSettingsPage;
