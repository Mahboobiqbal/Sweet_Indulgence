import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import mockStores from "../data/mockStores";

const Home = () => {
  const [stores, setStores] = useState([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showVideo, setShowVideo] = useState(true);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setStores(mockStores);
  }, []);

  const handlePlayPause = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff9f5]">
      {/* Hero section */}
      {showVideo ? (
        <div className="relative mb-12 shadow-lg overflow-hidden">
          <video
            ref={videoRef}
            className="w-full h-auto"
            src="src\Video\HeroVideo.mp4"
            autoPlay={true}
            muted={true}
            loop={true}
            playsInline={true}
            controls={false}
            preload="auto"
            onError={(e) => console.error("Video error:", e)}
          >
            Your browser does not support the video tag.
          </video>

          {/* Play/Pause Button */}
          <button
            onClick={handlePlayPause}
            className="absolute bottom-8 right-8 w-16 h-16 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 flex items-center justify-center transition-all duration-300 z-10"
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
          </button>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center bg-black/30 p-8 rounded-lg backdrop-blur-sm max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Welcome to Bake House
              </h1>
              <p className="text-xl text-white mb-6">
                Crafting sweet memories, one cake at a time
              </p>
              <button
                className="bg-[#d3756b] hover:bg-[#c25d52] text-white px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105"
                onClick={() => navigate("/about")}
              >
                Discover Our Story
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-96 mb-12 rounded-lg shadow-lg bg-[#f8e8e0] flex items-center justify-center relative">
          <div className="text-center p-8">
            <h1 className="text-4xl font-bold text-[#5e3023] mb-4">
              Welcome to Sweet Indulgence
            </h1>
            <p className="text-xl text-[#8c5f53] mb-6">
              Crafting sweet memories, one cake at a time
            </p>
            <button
              className="bg-[#d3756b] hover:bg-[#c25d52] text-white px-6 py-3 rounded-full font-bold transition-all duration-300"
              onClick={() => setShowVideo(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 inline-block mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Show Video
            </button>
          </div>

          {/* Background Image (alternative to video) */}
          <div className="absolute inset-0 -z-10 overflow-hidden rounded-lg">
            <img
              src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1689&q=80"
              alt="Sweet Indulgence Bakery"
              className="w-full h-full object-cover opacity-30"
            />
          </div>
        </div>
      )}

      {/* About section */}
      <div className="text-center max-w-4xl mx-auto my-16 px-4">
        <div className="flex items-center justify-center mb-8">
          <div className="flex-grow border-t border-[#e7dcca] mr-4"></div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#5e3023] uppercase">
            Smiles Guaranteed
          </h2>
          <div className="flex-grow border-t border-[#e7dcca] ml-4"></div>
        </div>
        <p className="text-[#8c5f53] leading-relaxed text-lg">
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
          whenever you order them, as we bake fresh desserts and don't sell
          pre-baked ones.
          <br />
          Our gift platters and gift baskets are the best way to send good
          wishes to your loved ones and cheer them up. We have gift baskets
          available for Eid, New Year, birthday, and wedding celebrations. Give
          us a try, and you won't be disappointed that's a guarantee.
        </p>
      </div>

      {/* Featured Products section */}
      <div className="max-w-6xl mx-auto mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#5e3023] mb-2">
            Featured Products
          </h2>
          <p className="text-[#8c5f53] mb-8">
            Our most popular sweet creations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Chocolate Truffle Cake",
              image: "./src/assets/chocolate.jpg",
              price: "Rs. 2,500",
            },
            {
              name: "Fresh Fruit Tart",
              image: "./src/assets/tower.png",
              price: "Rs. 1,800",
            },
            {
              name: "Birthday Special Cake",
              image: "./src/assets/love.jpg",
              price: "Rs. 3,200",
            },
          ].map((product, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-lg transition-all duration-300"
            >
              <div className="h-64 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#5e3023] mb-2">
                  {product.name}
                </h3>
                <p className="text-[#d3756b] font-medium mb-4">
                  {product.price}
                </p>
                <button className="w-full bg-[#d3756b] hover:bg-[#c25d52] text-white py-2 rounded-lg font-medium transition-colors">
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured stores section */}
      <div className="text-center mb-10 px-4">
        <h2 className="text-3xl font-bold text-[#5e3023] mb-2">Our Stores</h2>
        <p className="text-[#8c5f53] mb-10">
          Discover our bakeries across Pakistan
        </p>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {stores.map((store) => (
              <div
                key={store.id}
                className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
                onClick={() => navigate(`/store/${store.id}`, { state: store })}
              >
                {/* Image container with fixed height */}
                <div className="h-64 w-full relative overflow-hidden">
                  <img
                    src={store.image}
                    alt={store.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Content container */}
                <div className="bg-white p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold text-[#5e3023] mb-2">
                    {store.name}
                  </h3>
                  <p className="text-[#8c5f53] mb-4">{store.location}</p>
                  <div className="mt-auto">
                    <button
                      className="w-full bg-[#d3756b] hover:bg-[#c25d52] text-white py-3 rounded-md font-medium transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/store/${store.id}`, { state: store });
                      }}
                    >
                      View Store
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="bg-[#f8e8e0] py-12 px-6 rounded-lg my-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#5e3023] mb-10">
            What Our Customers Say
          </h2>

          <div className="relative">
            <svg
              className="absolute top-0 left-0 w-16 h-16 text-[#d3756b] opacity-20 -translate-x-1/2 -translate-y-1/2"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 32 32"
            >
              <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
            </svg>

            <div className="relative">
              <p className="text-xl text-[#8c5f53] italic mb-6">
                "I ordered a birthday cake for my daughter and it was absolutely
                stunning! Not only did it look beautiful, but it tasted amazing
                too. Sweet Indulgence has become our go-to bakery for all
                celebrations."
              </p>
              <div className="flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
                  alt="Customer"
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div className="text-left">
                  <h4 className="font-bold text-[#5e3023]">Amina Tahir</h4>
                  <p className="text-sm text-[#8c5f53]">Islamabad</p>
                </div>
              </div>
            </div>

            <svg
              className="absolute bottom-0 right-0 w-16 h-16 text-[#d3756b] opacity-20 translate-x-1/2 translate-y-1/2"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 32 32"
            >
              <path d="M14.048 4c4.896 3.456 8.352 9.12 8.352 15.36 0 5.088-3.072 8.064-6.624 8.064-3.36 0-5.856-2.688-5.856-5.856 0-3.168 2.208-5.472 5.088-5.472.576 0 1.344.096 1.536.192-.48-3.264-3.552-7.104-6.624-9.024L14.048 4zm16.512 0c4.8 3.456 8.256 9.12 8.256 15.36 0 5.088-3.072 8.064-6.624 8.064-3.264 0-5.856-2.688-5.856-5.856 0-3.168 2.304-5.472 5.184-5.472.576 0 1.248.096 1.44.192-.48-3.264-3.456-7.104-6.528-9.024L30.56 4z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-[#5e3023] mb-4">
          Ready to Order?
        </h2>
        <p className="text-[#8c5f53] text-lg mb-8 max-w-2xl mx-auto">
          Make your celebration special with our delicious cakes and desserts.
          Order now for pickup or delivery!
        </p>
        <button
          className="bg-[#d3756b] hover:bg-[#c25d52] text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105"
          onClick={() => navigate("/products")}
        >
          Browse Our Products
        </button>
      </div>
    </div>
  );
};

export default Home;
