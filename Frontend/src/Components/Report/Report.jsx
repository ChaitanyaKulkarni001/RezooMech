import React, { useState, useContext } from "react";
import api from "../../api";
import { ThemeContext } from "../ThemeContext";
import { MdClose } from "react-icons/md";

const ComplaintForm = ({ onClose }) => {
  const { theme } = useContext(ThemeContext);
  const [formData, setFormData] = useState({
    complaint_type: "GD",
    description: "",
    violence_image: null,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, violence_image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("complaint_type", formData.complaint_type);
    data.append("description", formData.description);
    if (formData.violence_image) {
      data.append("violence_image", formData.violence_image);
    }

    try {
      await api.post("api/complaint-view/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Complaint submitted successfully!");
      onClose(); // Close the form on success
    } catch (error) {
      console.error("Error submitting complaint:", error);
      alert("Failed to submit complaint.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className={`p-6 w-96 rounded-xl shadow-lg ${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Report a Complaint</h2>
          {/* ❌ Fixed Close Button Issue */}
          <button onClick={() => onClose()} className="text-red-500 hover:text-red-700">
            <MdClose size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Complaint Type */}
          <div>
            <label className="block text-sm font-medium">Complaint Type</label>
            <select
              name="complaint_type"
              value={formData.complaint_type}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg bg-transparent"
            >
              <option value="GD">Group Discussion Complaint</option>
              <option value="Debate">Debate Complaint</option>
              <option value="Platform">Platform Complaint</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="3"
              className="w-full mt-1 p-2 border rounded-lg bg-transparent"
              placeholder="Describe your complaint..."
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium">Upload Evidence (if any)</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="mt-1 w-full border rounded-lg p-2"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 text-white font-medium rounded-lg transition duration-300 ease-in-out bg-blue-600 hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>

        {/* ❌ Fixed Close Button for Cancel */}
        <button
          onClick={() => onClose()} // ✅ Corrected onClose Execution
          className="mt-2 w-full py-2 text-red-500 font-medium rounded-lg hover:bg-red-100 transition duration-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ComplaintForm;
