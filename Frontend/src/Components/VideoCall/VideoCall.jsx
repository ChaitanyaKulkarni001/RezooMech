import React, { useState, useRef, useEffect, useContext } from 'react';
import api from '../../api';
import { ThemeContext } from '../ThemeContext';

const VideoCall = () => {
  const { theme } = useContext(ThemeContext);
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [username, setUsername] = useState('');
  const [complaintType, setComplaintType] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const modalRef = useRef(null);

  // Open the complaint modal
  const handleComplaint = () => {
    setShowComplaintForm(true);
  };

  // Handle form submission and post data via FormData
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', username);
    formData.append('complaint_type', complaintType);
    formData.append('description', description);
    if (imageFile) {
      formData.append('violence_image', imageFile);
    }
    try {
      const response = await api.post('api/complain/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Complaint submitted:', response.data);
      setShowComplaintForm(false);
      // Reset the form fields
      setUsername('');
      setComplaintType('');
      setDescription('');
      setImageFile(null);
    } catch (error) {
      console.error('Error submitting complaint:', error);
    }
  };

  // Close modal if clicking outside of it
  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setShowComplaintForm(false);
    }
  };

  useEffect(() => {
    if (showComplaintForm) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showComplaintForm]);

  return (
    <div className={`relative ${theme === 'dim' ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'}`}>
      {/* Fixed Report a Complaint Button at Bottom Right */}
      <button
        onClick={handleComplaint}
        className="fixed bottom-4 right-4 bg-red-600 hover:bg-red-700 text-white py-3 px-5 rounded-full shadow-lg z-80 transition duration-300 ease-in-out transform hover:scale-105"
      >
        Report a Complaint
      </button>

      {/* Complaint Modal */}
      {showComplaintForm && (
        <div className="fixed inset-0 flex items-center justify-center mt-12 z-60 bg-black bg-opacity-50">
          <div
            ref={modalRef}
            className={`rounded-lg p-8 w-96 shadow-2xl relative transform transition-all duration-300 scale-100 ${theme === 'dim' ? 'bg-white' : 'bg-gray-800'}`}
          >
            <div className="mb-6">
              <h2 className={`text-2xl font-bold mb-2 ${theme === 'dim' ? 'text-gray-800' : 'text-white'}`}>
                Report a Complaint
              </h2>
              <p className={`text-sm ${theme === 'dim' ? 'text-gray-600' : 'text-gray-300'}`}>
                Please provide your username, select the complaint type and additional details below.
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              {/* Username Field */}
              <div className="mb-4">
                <label className="block font-medium mb-2 text-gray-700">Username:</label>
                <input
                  type="text"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your username"
                  className={`w-full border rounded-lg p-3 focus:outline-none focus:border-blue-500 ${theme === 'dim' ? 'border-gray-300' : 'border-gray-600'}`}
                  required
                />
              </div>

              {/* Complaint Type */}
              <div className="mb-4">
                <label className="block font-medium mb-2 text-gray-700">Complaint Type:</label>
                <div className="flex flex-col space-y-3">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="complaintType"
                      value="GD"
                      checked={complaintType === 'GD'}
                      onChange={(e) => setComplaintType(e.target.value)}
                      className="form-radio text-blue-600"
                      required
                    />
                    <span className="ml-3 text-gray-700">General Complaint</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="complaintType"
                      value="Debate"
                      checked={complaintType === 'Debate'}
                      onChange={(e) => setComplaintType(e.target.value)}
                      className="form-radio text-blue-600"
                    />
                    <span className="ml-3 text-gray-700">Debate Complaint</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="complaintType"
                      value="Platform"
                      checked={complaintType === 'Platform'}
                      onChange={(e) => setComplaintType(e.target.value)}
                      className="form-radio text-blue-600"
                    />
                    <span className="ml-3 text-gray-700">Platform Complaint</span>
                  </label>
                </div>
              </div>

              {/* Description Field */}
              <div className="mb-4">
                <label className="block font-medium mb-2 text-gray-700">Description:</label>
                <textarea 
                  name="description"
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`w-full border rounded-lg p-3 focus:outline-none focus:border-blue-500 ${theme === 'dim' ? 'border-gray-300' : 'border-gray-600'}`}
                  placeholder="Provide more details about your complaint..."
                  required
                ></textarea>
              </div>

              {/* Image Upload Field */}
              <div className="mb-6">
                <label className="block font-medium mb-2 text-gray-700">Upload Image (if any):</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="block w-full text-sm text-gray-500"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button 
                  type="button" 
                  onClick={() => setShowComplaintForm(false)} 
                  className="px-5 py-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 transition duration-300"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300"
                >
                  Submit
                </button>
              </div>
            </form>
            {/* Close Button */}
            <button 
              onClick={() => setShowComplaintForm(false)} 
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition duration-300"
            >
              &#10005;
            </button>
          </div>
        </div>
      )}

      {/* Video Call Iframe */}
      <iframe 
        // src="http://192.168.145.48:8000/"  
        src="http://127.0.0.1:8000/"  
        allow="camera; microphone; display-capture" 
        width="100%" 
        height="800px"
        className="mt-4"
      ></iframe>
    </div>
  );
};

export default VideoCall;
