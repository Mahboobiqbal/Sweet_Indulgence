import React, { useState, useEffect } from "react";

const HomePage = () => {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    // Simulating fetching data from a database (Firebase would be used here)
    const mockStores = [
      {
        id: 1,
        name: "Delicious Cakes Bakery",
        location: "Mingora, Pakistan",
        menu: ["Chocolate Cake", "Cupcakes", "Macarons"],
        image:
          "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?q=80&w=1452&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        id: 2,
        name: "Sweet Treats Hub",
        location: "Islamabad, Pakistan",
        menu: ["Cheesecake", "Brownies", "Fruit Tart"],
        image:
          "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGJpcnRoZGF5JTIwY2FrZXxlbnwwfHwwfHx8MA%3D%3D",
      },
      {
        id: 3,
        name: "Royal Bakers",
        location: "Karachi, Pakistan",
        menu: ["Black Forest Cake", "Donuts", "Eclairs"],
        image:
          "https://images.unsplash.com/photo-1624006229221-2abd931f266b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGJpcnRoZGF5JTIwY2FrZXxlbnwwfHwwfHx8MA%3D%3D",
      },
      {
        id: 4,
        name: "Golden Oven",
        location: "Lahore, Pakistan",
        menu: ["Butter Cookies", "Cinnamon Rolls", "Pecan Pie"],
        image:
          "https://images.unsplash.com/photo-1586985289906-406988974504?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGJpcnRoZGF5JTIwY2FrZXxlbnwwfHwwfHx8MA%3D%3D",
      },
      {
        id: 5,
        name: "The Sweet Corner",
        location: "Rawalpindi, Pakistan",
        menu: ["Vanilla Cake", "Fruit Pie", "Muffins"],
        image:
          "https://images.unsplash.com/photo-1610670444950-0b29430891b4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGJpcnRoZGF5JTIwY2FrZXxlbnwwfHwwfHx8MA%3D%3D",
      },
      {
        id: 6,
        name: "Fluffy Bakes",
        location: "Peshawar, Pakistan",
        menu: ["Sponge Cake", "Swiss Rolls", "Choco Lava Cake"],
        image:
          "https://images.unsplash.com/photo-1595272568891-123402d0fb3b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGJpcnRoZGF5JTIwY2FrZXxlbnwwfHwwfHx8MA%3D%3D",
      },
      {
        id: 7,
        name: "Sugar Rush Café",
        location: "Quetta, Pakistan",
        menu: ["Strawberry Shortcake", "Choco Chip Cookies", "Tiramisu"],
        image:
          "https://images.unsplash.com/photo-1559553156-2e97137af16f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fGJpcnRoZGF5JTIwY2FrZXxlbnwwfHwwfHx8MA%3D%3D",
      },
      {
        id: 8,
        name: "Creamy Delights",
        location: "Faisalabad, Pakistan",
        menu: ["Red Velvet Cake", "Pastries", "Baklava"],
        image:
          "https://images.unsplash.com/photo-1604413191066-4dd20bedf486?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjd8fGJpcnRoZGF5JTIwY2FrZXxlbnwwfHwwfHx8MA%3D%3D",
      },
      {
        id: 9,
        name: "Sweet Symphony",
        location: "Hyderabad, Pakistan",
        menu: ["Fudge Brownies", "Caramel Tart", "Ice Cream Cake"],
        image:
          "https://images.unsplash.com/photo-1568827999250-3f6afff96e66?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fGJpcnRoZGF5JTIwY2FrZXxlbnwwfHwwfHx8MA%3D%3D",
      },
      {
        id: 10,
        name: "Heavenly Bakes",
        location: "Multan, Pakistan",
        menu: ["Lemon Cake", "Mocha Cupcakes", "Pineapple Upside-down Cake"],
        image:
          "https://images.unsplash.com/photo-1577998474517-7eeeed4e448a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGJpcnRoZGF5fGVufDB8fDB8fHww",
      },
    ];
    setStores(mockStores);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <video
        className="w-full h-auto mb-6 rounded-lg shadow-lg"
        src="/video/HeroVideo.mp4"
        autoPlay
        muted
        loop
        playsInline
      >
        Your browser does not support the video tag.
      </video>

      <div className="text-center max-w-4xl mx-auto my-12 px-4">
        <div className="flex items-center justify-center mb-6">
          <div className="flex-grow border-t border-gray-300 mr-4"></div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 uppercase">
            Smiles Guaranteed
          </h2>
          <div className="flex-grow border-t border-gray-300 ml-4"></div>
        </div>
        <p className="text-gray-600 leading-relaxed">
          The Bake House Inc is the official smiles provider in Swat. We sell
          the best cakes in Swat. Our cakes are handcrafted with the finest
          ingredients, attention, and pure love. Our customized cakes are the
          best in Swat and are a showstopper at every party. Our wedding cakes,
          birthday cakes, anniversary cakes, and picture-printed cakes not only
          look beautiful but also taste amazing. For the best customized cake
          delivery, order at the Baketown.
          <br />
          Our major products are customized cakes, regular cakes, fresh tea
          cakes, brownies, fresh cookies, hot pies, cheesecakes, and gift
          baskets. Our tea-time desserts like fudge brownies, cookies, tarts,
          and pies are the talk of the town, and they reach you fresh and warm
          whenever you order them, as we bake fresh desserts and don’t sell
          pre-baked ones.
          <br />
          Our gift platters and gift baskets are the best way to send good
          wishes to your loved ones and cheer them up. We have gift baskets
          available for Eid, New Year, birthday, and wedding celebrations. Give
          us a try, and you won’t be disappointed that’s a guarantee.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store) => (
          <div
            key={store.id}
            className="bg-white p-4 shadow-md rounded-lg text-center"
          >
            <img
              src={store.image}
              alt={store.name}
              className="w-full h-40 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold text-pink-500">
              {store.name}
            </h2>
            <p className="text-gray-600">{store.location}</p>
            <h3 className="text-lg font-bold mt-2">Menu:</h3>
            <ul className="list-disc list-inside text-gray-700">
              {store.menu.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <button
              className="mt-4 bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
              onClick={() => navigate(`/store/${store.id}`, { state: store })} // Navigate with store data
            >
              View Store
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
