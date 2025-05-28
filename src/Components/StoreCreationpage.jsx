import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const StoreCreationPage = () => {
  const navigate = useNavigate();
  const [storeData, setStoreData] = useState({
    name: "",
    location: "",
    description: "",
    menuItems: "",
  });

  const handleChange = (e) => {
    setStoreData({ ...storeData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Store Data:", storeData);
    // Here, you can integrate Firebase to save store details
    navigate("/supplier-dashboard"); // Redirect after store creation
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg w-96">
        <h2 className="text-2xl font-bold text-center text-pink-600 mb-6">
          Create Your Store
        </h2>

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-gray-700">Store Name</label>
          <input
            type="text"
            name="name"
            className="w-full p-2 border rounded mb-4"
            placeholder="Enter store name"
            onChange={handleChange}
            required
          />

          <label className="block mb-2 text-gray-700">Location</label>
          <input
            type="text"
            name="location"
            className="w-full p-2 border rounded mb-4"
            placeholder="Enter store location"
            onChange={handleChange}
            required
          />

          <label className="block mb-2 text-gray-700">Description</label>
          <textarea
            name="description"
            className="w-full p-2 border rounded mb-4"
            placeholder="Describe your store"
            onChange={handleChange}
            required
          />

          <label className="block mb-2 text-gray-700">
            Menu Items (comma-separated)
          </label>
          <input
            type="text"
            name="menuItems"
            className="w-full p-2 border rounded mb-4"
            placeholder="e.g., Chocolate Cake, Cupcakes, Macarons"
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600"
          >
            Create Store
          </button>
        </form>
      </div>
    </div>
  );
};

export default StoreCreationPage;
