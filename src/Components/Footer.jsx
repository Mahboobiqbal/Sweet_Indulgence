import React from "react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#e7dcca] text-[#3b2a24] py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo and description */}
        <div className="col-span-1 md:col-span-4 text-center mb-8">
          <h2 className="text-3xl font-bold text-[#5e3023] mb-3">
            Sweet Indulgence
          </h2>
          <p className="text-[#8c5f53] max-w-2xl mx-auto">
            Bringing smiles with every sweet creation. Your trusted partner for
            celebrations.
          </p>
        </div>

        {/* Left Links */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-[#5e3023]">Quick Links</h3>
          <ul className="space-y-3 text-[#8c5f53]">
            <li className="hover:text-[#d3756b] cursor-pointer transition-colors">
              Home
            </li>
            <li className="hover:text-[#d3756b] cursor-pointer transition-colors">
              About
            </li>
            <li className="hover:text-[#d3756b] cursor-pointer transition-colors">
              Shop
            </li>
            <li className="hover:text-[#d3756b] cursor-pointer transition-colors">
              Blog
            </li>
            <li className="hover:text-[#d3756b] cursor-pointer transition-colors">
              Contact
            </li>
          </ul>
        </div>

        {/* Middle Links */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-[#5e3023]">Policies</h3>
          <ul className="space-y-3 text-[#8c5f53]">
            <li className="hover:text-[#d3756b] cursor-pointer transition-colors">
              FAQs
            </li>
            <li className="hover:text-[#d3756b] cursor-pointer transition-colors">
              Terms & Conditions
            </li>
            <li className="hover:text-[#d3756b] cursor-pointer transition-colors">
              Privacy Policy
            </li>
            <li className="hover:text-[#d3756b] cursor-pointer transition-colors">
              Shipping Policy
            </li>
            <li className="hover:text-[#d3756b] cursor-pointer transition-colors">
              Refund Policy
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-[#5e3023]">Contact Us</h3>
          <ul className="space-y-3 text-[#8c5f53]">
            <li>
              <a
                href="mailto:baketowninc@gmail.com"
                className="hover:text-[#d3756b] transition-colors"
              >
                baketowninc@gmail.com
              </a>
            </li>
            <li className="flex items-center">
              <FaWhatsapp className="mr-2" /> +92 307 4443780
            </li>
            <li>Mingora, Swat, Pakistan</li>
          </ul>
          <div className="flex space-x-4 mt-4">
            <a
              href="#"
              className="p-2 border border-[#8c5f53] rounded-full text-[#8c5f53] hover:bg-[#8c5f53] hover:text-white transition-colors"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              className="p-2 border border-[#8c5f53] rounded-full text-[#8c5f53] hover:bg-[#8c5f53] hover:text-white transition-colors"
            >
              <FaInstagram />
            </a>
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-[#5e3023]">
            Stay Connected
          </h3>
          <p className="mb-3 text-[#8c5f53]">
            Subscribe to receive updates on special offers and events
          </p>
          <input
            type="email"
            placeholder="Your email address"
            className="w-full p-3 border border-[#8c5f53] rounded-full mb-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-[#d3756b]"
          />
          <button className="w-full bg-[#d3756b] text-white py-3 rounded-full hover:bg-[#c25d52] transition-colors font-bold">
            SUBSCRIBE
          </button>
        </div>

        {/* Copyright */}
        <div className="col-span-1 md:col-span-4 text-center mt-8 pt-8 border-t border-[#8c5f53]">
          <p className="text-[#8c5f53]">
            © {new Date().getFullYear()} Sweet Indulgence. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
