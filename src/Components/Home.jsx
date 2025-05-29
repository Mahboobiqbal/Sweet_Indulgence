import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import mockStores from "../data/mockStores";

const HomePage = () => {
  const [stores, setStores] = useState([]);
  const navigate = useNavigate();
  const [showVideo, setShowVideo] = useState(true);

  useEffect(() => {
    setStores(mockStores);
  }, []);

  return (
    <div className="min-h-screen bg-[#fff9f5] p-6">
      {/* Hero section */}
      {showVideo ? (
        <div className="relative mb-12">
          <video
            className="w-full h-auto rounded-lg shadow-lg"
            src="/video/HeroVideo.mp4"
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
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center bg-black/30 p-8 rounded-lg backdrop-blur-sm max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Welcome to Sweet Indulgence
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
        <div className="w-full h-96 mb-12 rounded-lg shadow-lg bg-[#f8e8e0] flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-4xl font-bold text-[#5e3023] mb-4">
              Welcome to Sweet Indulgence
            </h1>
            <p className="text-xl text-[#8c5f53] mb-6">
              Crafting sweet memories, one cake at a time
            </p>
            <button
              className="ml-4 bg-[#d3756b] text-white px-4 py-2 rounded-full"
              onClick={() => setShowVideo(true)}
            >
              Enable Video
            </button>
          </div>
        </div>
      )}

      {/* Dev toggle button */}
      <div className="mb-4 flex justify-end">
        <button
          className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
          onClick={() => setShowVideo(!showVideo)}
        >
          {showVideo ? "Disable Video (Dev Mode)" : "Enable Video"}
        </button>
      </div>

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
          <br />
          Our major products are customized cakes, regular cakes, fresh tea
          cakes, brownies, fresh cookies, hot pies, cheesecakes, and gift
          baskets. Our tea-time desserts like fudge brownies, cookies, tarts,
          and pies are the talk of the town, and they reach you fresh and warm
          whenever you order them, as we bake fresh desserts and don't sell
          pre-baked ones.
          <br />
          <br />
          Our gift platters and gift baskets are the best way to send good
          wishes to your loved ones and cheer them up. We have gift baskets
          available for Eid, New Year, birthday, and wedding celebrations. Give
          us a try, and you won't be disappointed that's a guarantee.
        </p>
      </div>

      {/* Featured stores section */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-[#5e3023] mb-2">Our Stores</h2>
        <p className="text-[#8c5f53] mb-10">
          Discover our bakeries across Pakistan
        </p>

        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 mx-auto">
            {stores.map((store) => (
              <div
                key={store.id}
                className="relative w-120 h-120 rounded-lg overflow-hidden group shadow-lg mx-auto hover:shadow-xl transition-all duration-300"
                onClick={() => navigate(`/store/${store.id}`, { state: store })}
              >
                {/* Image */}
                <img
                  src={store.image}
                  alt={store.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end pb-[60px]">
                  <div className="mb-3">
                    <h2 className="text-xl font-semibold text-white">
                      {store.name}
                    </h2>
                    <p className="text-gray-200 text-sm">
                      {store.location}
                    </p>
                  </div>

                  <button
                    className="bg-[#d3756b] hover:bg-[#c25d52] text-white py-[20px] w-full transition-colors cursor-pointer"
                    onClick={() => navigate(`/store/${store.id}`, { state: store })}
                  >
                    View Store
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
