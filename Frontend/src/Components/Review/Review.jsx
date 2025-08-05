import React, { useState, useContext } from 'react';
import api from '../../api';
import { FaStar } from 'react-icons/fa';
import { ThemeContext } from '../ThemeContext';
const Review = () => {
  const [username, setUsername] = useState('');
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || rating === 0) {
      alert("Please provide your name and select a rating.");
      return;
    }
    try {
      await api.post('/api/rate/', { username, rating, feedback });
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Error submitting rating. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-gray-800">Thank you!</h2>
        <p className="mt-2 text-gray-600">Your rating has been submitted.</p>
      </div>
    );
  }
  const {theme} = useContext(ThemeContext)
  return (
    <div className={`max-w-xl mx-auto p-6 ${theme==="dim"?"bg-white":"bg-gray-700"} rounded-lg shadow-md`}>
      <h2 className={ ` text-3xl font-bold ${theme=="dim"?"text-gray-800":"text-white"} mb-4`}>Rate Us</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={`block ${theme=="dim"?"text-gray-700":"text-white"} font-medium`}>Username</label>
          <input 
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your name"
            required
            className={`mt-1 w-full border  ${theme=="dim"?"text-gray-700":"text-black"}    rounded-lg p-3 focus:ring-2 focus:ring-blue-500 transition duration-200`}
          />
        </div>
        <div>
          <label className={  `block   ${theme=="dim"?"text-gray-700":"text-white"} font-medium mb-2`}>Rating</label>
          <div className="flex space-x-1">
            {[1,2,3,4,5].map((star) => (
              <FaStar
                key={star}
                size={30}
                className={`cursor-pointer transition-colors duration-200 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
        </div>
        <div>
          <label className={`blockfont-medium  ${theme=="dim"?"text-gray-700":"text-white"}  `}>Feedback</label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows="4"
            placeholder="Optional feedback..."
            className={ `mt-1 w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2  ${theme=="dim"?"text-gray-700":"text-black"}  focus:ring-blue-500 transition duration-200`}
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 transition duration-200"
        >
          Submit Rating
        </button>
      </form>
    </div>
  );
};

export default Review;
