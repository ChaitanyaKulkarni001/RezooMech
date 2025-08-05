import { useState } from "react";

const EducationForm = ({ onBack, onNext, onSave }) => {
  const [educationRecords, setEducationRecords] = useState([]);
  const [education, setEducation] = useState({
    schoolName: "",
    degree: "",
    location: "",
    fieldOfStudy: "",
    graduationMonth: "",
    graduationYear: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEducation((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddEducation = (e) => {
    e.preventDefault();
    // Add the current education record to the list.
    setEducationRecords([...educationRecords, education]);
    // Reset the form for a new entry.
    setEducation({
      schoolName: "",
      degree: "",
      location: "",
      fieldOfStudy: "",
      graduationMonth: "",
      graduationYear: "",
      description: "",
    });
  };

  const handleNext = () => {
    // If the current form isn't empty, add it to the list.
    const isEmpty = Object.values(education).every((val) => val === "");
    const allRecords = !isEmpty ? [...educationRecords, education] : educationRecords;
    onSave(allRecords);
    onNext();
  };

  const handleBack = () => {
    onBack();
  };

  return (
    <div className="w-full px-4 py-6">
      <h2 className="text-2xl font-bold text-center mb-2">Education</h2>
      <p className="text-center text-gray-600 mb-6">
        Add your education details below, starting with your most recent education.
      </p>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto">
        <form onSubmit={handleAddEducation} className="grid gap-6">
          {/* School Name & Degree */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="schoolName"
              placeholder="School Name"
              value={education.schoolName}
              onChange={handleChange}
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="degree"
              placeholder="Degree"
              value={education.degree}
              onChange={handleChange}
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* School Location & Field of Study */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="location"
              placeholder="School Location"
              value={education.location}
              onChange={handleChange}
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="fieldOfStudy"
              placeholder="Field of Study"
              value={education.fieldOfStudy}
              onChange={handleChange}
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Graduation Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="graduationMonth"
              value={education.graduationMonth}
              onChange={handleChange}
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Month</option>
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
                (month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                )
              )}
            </select>
            <input
              type="number"
              name="graduationYear"
              placeholder="Year"
              value={education.graduationYear}
              onChange={handleChange}
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description / Special Awards */}
          <textarea
            name="description"
            placeholder="Description or Special Awards (Optional)"
            value={education.description}
            onChange={handleChange}
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            rows="3"
          ></textarea>

          {/* Add Education Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Education
            </button>
          </div>
        </form>

        {/* Display added education records */}
        {educationRecords.length > 0 && (
          <div className="bg-gray-100 p-6 rounded-md shadow-md mt-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Added Education</h3>
            <ul className="space-y-4">
              {educationRecords.map((edu, index) => (
                <li key={index} className="border p-4 rounded-md">
                  <p className="font-semibold">
                    {edu.degree} at {edu.schoolName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {edu.graduationMonth} {edu.graduationYear}
                  </p>
                  {edu.fieldOfStudy && (
                    <p className="text-sm text-gray-600">Field: {edu.fieldOfStudy}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button onClick={handleBack} className="text-purple-600 hover:underline">
            Back
          </button>
          <button
            onClick={handleNext}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Next: Work Experience
          </button>
        </div>
      </div>
    </div>
  );
};

export default EducationForm;
