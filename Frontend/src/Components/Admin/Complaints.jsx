import React, { useEffect, useState } from "react";
import api from "../../api"; // Using your existing API instance
import { FaExclamationCircle } from "react-icons/fa";

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await api.get("/api/complain/");
      console.log(response);
      
      setComplaints(Array.isArray(response.data.results) ? response.data.results : []); // Ensures array
    } catch (error) {
      console.error("Error fetching complaints:", error);
      setComplaints([]); // Handle errors by setting an empty array
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4 flex items-center">
          <FaExclamationCircle className="text-red-500 mr-2" /> Complaints
        </h2>

        {loading ? (
          <p className="text-gray-600 text-center">Loading complaints...</p>
        ) : complaints.length === 0 ? (
          <p className="text-gray-600 text-center">No complaints available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg shadow-md">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border p-3 text-left">User</th>
                  <th className="border p-3 text-left">complaint_type</th>
                  <th className="border p-3 text-left">Description</th>
                  <th className="border p-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((complaint) => (
                  <tr key={complaint.id} className="border-t hover:bg-gray-100">
                    <td className="border p-3">{complaint.username}</td>
                    <td className="border p-3 font-semibold">{complaint.complaint_type}</td>
                    <td className="border p-3">{complaint.description}</td>
                    <td className="border p-3 text-gray-500">{new Date(complaint.created_at).toLocaleString()}</td>
                    <td className="border p-3">
        {complaint.violence_image ? (
          <img
            src={complaint.violence_image}
            alt="complaint.violence_image"
            
            className="h-16 w-16 object-cover rounded-lg shadow-md"
          />
        ) : (
          <span className="text-gray-400 italic">No Image</span>
        )}
      </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Complaints;
