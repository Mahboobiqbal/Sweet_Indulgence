import React from "react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#e7dcca] text-[#3b2a24] py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left Links */}
        <div>
          <ul className="space-y-2">
            <li>Home</li>
            <li>About</li>
            <li>Shop</li>
            <li>Blog</li>
            <li>Contact</li>
          </ul>
        </div>

        {/* Middle Links */}
        <div>
          <ul className="space-y-2">
            <li>FAQs</li>
            <li>Terms & Conditions</li>
            <li>Privacy Policy</li>
            <li>Shipping Policy</li>
            <li>Refund Policy</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-2">
          <p>
            Email:{" "}
            <a href="mailto:baketowninc@gmail.com" className="underline">
              baketowninc@gmail.com
            </a>
          </p>
          <p>Whatsapp: +92 307 4443780</p>
          <div className="flex space-x-4 mt-2">
            <a href="#" className="p-2 border rounded-full">
              <FaFacebookF />
            </a>
            <a href="#" className="p-2 border rounded-full">
              <FaInstagram />
            </a>
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="font-semibold mb-2">Let’s Stay Connected</h3>
          <input
            type="email"
            placeholder="Your email address"
            className="w-full p-2 border mb-2"
          />
          <button className="w-full bg-[#2c130f] text-white py-2 hover:bg-[#3b1c18]">
            SUBSCRIBE
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
