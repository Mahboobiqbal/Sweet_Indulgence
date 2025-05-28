import React from "react";
import { useLocation } from "react-router-dom";

const StoreDetailsPage = () => {
  const location = useLocation();
  const store = location.state; // Retrieve store data from navigation

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <div className="bg-white p-8 shadow-lg rounded-lg max-w-lg w-full text-center">
        <img
          src={store.image}
          alt={store.name}
          className="w-full h-40 object-cover rounded-md mb-4"
        />
        <h1 className="text-3xl font-bold text-pink-600 mb-2">{store.name}</h1>
        <p className="text-gray-600 text-lg mb-4">Location: {store.location}</p>

        <h2 className="text-xl font-bold text-pink-500 mb-3">Menu Items</h2>
        <ul className="list-disc list-inside text-gray-700">
          {store.menu.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <button
          className="mt-6 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          onClick={() => window.history.back()} // Navigate back to HomePage
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default StoreDetailsPage;
