import React from "react";
import { useNavigate } from "react-router-dom";

function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-200 flex items-center justify-center px-4 py-5">
      <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-4xl w-full flex flex-col md:flex-row items-center">
        {/* Text Section */}
        <div className="md:w-2/3">
          <h1 className="text-4xl font-extrabold text-pink-500 mb-6 text-center">
            About Sweet Indulgence
          </h1>

          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            Welcome to **Sweet Indulgence** – your one-stop platform for
            ordering customized cakes, sweets, and event planning services.
            Whether you're celebrating a **birthday, anniversary, or special
            event**, we connect customers with **top-tier suppliers** to ensure
            a seamless experience.
          </p>

          <h2 className="text-2xl font-bold text-pink-500 mt-6 mb-3">
            🚀 Our Features
          </h2>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>
              Real-time **chat integration** for instant queries &
              customization.
            </li>
            <li>Secure **payment gateway** for smooth transactions.</li>
            <li>
              Easy **supplier profiles** showcasing menus, pricing, and event
              packages.
            </li>
            <li>
              User-friendly, modern **React.js interface** with Tailwind CSS
              styling.
            </li>
            <li>
              Interactive **event planning module** for seamless organization.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-pink-500 mt-6 mb-3">
            🌟 Why Choose Sweet Indulgence?
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            Our goal is to provide a **scalable, intuitive** platform that
            simplifies event planning and bakery orders while ensuring seamless
            **supplier-customer engagement**. Designed with **React.js**,
            Firebase, and Tailwind CSS, this system allows for real-time
            communication, customized cake selections, and easy payment
            processing.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <button
              onClick={() => navigate("/")}
              className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors"
            >
              Back to Home
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
            >
              Contact Us
            </button>
          </div>
        </div>

        {/* Image Section */}
        <div className="hidden md:block md:w-1/3 pl-6">
          <img
            src="https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?q=80&w=1452&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Cake"
            className="rounded-lg shadow-lg mb-4"
          />
          <img
            src="https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGJpcnRoZGF5JTIwY2FrZXxlbnwwfHwwfHx8MA%3D%3D"
            alt="Cupcakes"
            className="rounded-lg shadow-lg mb-4"
          />
          <img
            src="https://images.unsplash.com/photo-1610670444950-0b29430891b4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGJpcnRoZGF5JTIwY2FrZXxlbnwwfHwwfHx8MA%3D%3D"
            alt="Desserts"
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}

export default About;
