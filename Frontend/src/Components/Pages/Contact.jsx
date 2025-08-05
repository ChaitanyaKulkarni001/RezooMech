import React, { useState } from 'react'
import api from '../../api';
export default function Contact() {
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Send the form data to the backend
    api.post('/api/send-email/', formData)
      .then(response => {
        alert('Email sent successfully!');
      })
      .catch(error => {
        alert('Please check if you are logged in!');
      });
  };
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
<div>
  <section className="bg-white min-h-screen flex items-center justify-center px-6">
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full border border-gray-200">
      <h2 className="text-4xl font-extrabold text-center text-gray-900">Get in Touch</h2>
      <p className="text-lg text-gray-600 text-center mt-3">
        Need assistance with your interview preparation? We're here to help.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-4">
            <label className="block text-white text-lg mb-2">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-white text-lg mb-2">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border text-gray-800 border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-white text-lg mb-2">Message:</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-blue-400"
              rows="4"
              placeholder="Share your thoughts"
              required
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="w-full py-3 mt-4 bg-indigo-700 hover:bg-indigo-800 text-white text-lg font-bold rounded-lg transition duration-300 ease-in-out"
          >
            Send Message
          </button>
        </form>
    </div>
  </section>
</div>

  )
}
