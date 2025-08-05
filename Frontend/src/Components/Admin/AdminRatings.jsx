import React, { useEffect, useState } from 'react';
import api from '../../api';
import { FaStar } from 'react-icons/fa';

const AdminRatings = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    try {
      const res = await api.get('/api/admin-ratings/');
      setRatings(Array.isArray(res.data.results) ? res.data.results : []);
    } catch (error) {
      console.error("Error fetching ratings:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">User Ratings</h2>
        {loading ? (
          <p className="text-gray-600 text-center">Loading ratings...</p>
        ) : ratings.length === 0 ? (
          <p className="text-gray-600 text-center">No ratings available.</p>
        ) : (
          <div className="space-y-4">
            {ratings.map((r) => (
              <div key={r.id} className="border p-4 rounded-lg shadow-sm bg-gray-100 flex flex-col sm:flex-row items-center justify-between">
                <div className="flex flex-col sm:flex-row items-center space-x-4 mb-2 sm:mb-0">
                  <h3 className="text-xl font-semibold text-gray-800">{r.username}</h3>
                  <div className="flex space-x-1">
                    {[1,2,3,4,5].map((star) => (
                      <FaStar key={star} size={20} className={star <= r.rating ? 'text-yellow-400' : 'text-gray-300'} />
                    ))}
                  </div>
                </div>
                <div className="flex-1 mt-2 sm:mt-0 sm:ml-4 text-gray-700">{r.feedback}</div>
                <div className="text-sm text-gray-500">{new Date(r.created_at).toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRatings;
