import React, { useState } from "react";

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User Message:", formData);
    alert("Thank you for reaching out! We will get back to you soon.");
    setFormData({ name: "", email: "", message: "" }); // Reset form
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-8 shadow-lg rounded-lg max-w-lg w-full">
        <h2 className="text-3xl font-bold text-center text-pink-600 mb-6">
          Contact Us
        </h2>

        <p className="text-gray-700 text-center mb-6">
          Have questions or special requests? Reach out to us and we'll be happy
          to assist!
        </p>

        {/* Contact Details */}
        <div className="text-center mb-6">
          <p className="text-gray-600">
            <strong>Email:</strong> support@sweetindulgence.com
          </p>
          <p className="text-gray-600">
            <strong>Phone:</strong> +92-123-456-7890
          </p>
          <p className="text-gray-600">
            <strong>Location:</strong> Mingora, Khyber Pakhtunkhwa, Pakistan
          </p>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            value={formData.name}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            value={formData.email}
            required
          />

          <textarea
            name="message"
            placeholder="Your Message"
            className="w-full p-2 border rounded"
            rows="4"
            onChange={handleChange}
            value={formData.message}
            required
          />

          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUsPage;
