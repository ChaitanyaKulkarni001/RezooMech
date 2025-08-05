import { useState } from "react";

const WorkExperienceForm = ({ onBack, onNext, onSave }) => {
  const [workExperiences, setWorkExperiences] = useState([]);
  const [workExperience, setWorkExperience] = useState({
    jobTitle: "",
    employer: "",
    city: "",
    country: "",
    startMonth: "",
    startYear: "",
    endMonth: "",
    endYear: "",
    currentlyWorking: false,
    description: "", // New field for job explanation/description
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setWorkExperience((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddExperience = (e) => {
    e.preventDefault();
    // Add the current work experience to the list.
    setWorkExperiences([...workExperiences, workExperience]);
    // Reset the work experience form.
    setWorkExperience({
      jobTitle: "",
      employer: "",
      city: "",
      country: "",
      startMonth: "",
      startYear: "",
      endMonth: "",
      endYear: "",
      currentlyWorking: false,
      description: "",
    });
  };

  const handleNext = () => {
    // If there's an unsubmitted work experience (jobTitle exists), add it.
    const allExperiences = workExperience.jobTitle.trim()
      ? [...workExperiences, workExperience]
      : workExperiences;
    // Pass the entire array back to the parent.
    onSave(allExperiences);
    onNext();
  };

  const handleBack = () => {
    onBack();
  };

  return (
    <div className="w-full px-4 py-6">
      <h2 className="text-2xl font-bold text-center mb-2">Work Experience</h2>
      <p className="text-center text-gray-600 mb-6">
        Add your work experience details below. Include job title, employer,
        location, dates, and a brief description of your responsibilities or achievements.
      </p>

      <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto">
        <form onSubmit={handleAddExperience} className="grid gap-6">
          {/* Job Title & Employer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="jobTitle"
              placeholder="Job Title"
              value={workExperience.jobTitle}
              onChange={handleChange}
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="employer"
              placeholder="Employer"
              value={workExperience.employer}
              onChange={handleChange}
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="city"
              placeholder="City/Town"
              value={workExperience.city}
              onChange={handleChange}
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={workExperience.country}
              onChange={handleChange}
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Start Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="startMonth"
              value={workExperience.startMonth}
              onChange={handleChange}
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Start Month</option>
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
              name="startYear"
              placeholder="Start Year"
              value={workExperience.startYear}
              onChange={handleChange}
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* End Date (if not currently working) */}
          {!workExperience.currentlyWorking && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                name="endMonth"
                value={workExperience.endMonth}
                onChange={handleChange}
                className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">End Month</option>
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
                name="endYear"
                placeholder="End Year"
                value={workExperience.endYear}
                onChange={handleChange}
                className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Checkbox for Currently Working */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="currentlyWorking"
              checked={workExperience.currentlyWorking}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-gray-600">I currently work here</label>
          </div>

          {/* Job Description / Explanation */}
          <div>
            <textarea
              name="description"
              placeholder="Job Description / Explanation (e.g., responsibilities, achievements)"
              value={workExperience.description}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            ></textarea>
          </div>

          {/* Add Experience Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Work Experience
            </button>
          </div>
        </form>

        {/* Display added work experiences */}
        {workExperiences.length > 0 && (
          <div className="bg-gray-100 p-6 rounded-md shadow-md mt-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Added Work Experiences
            </h3>
            <ul className="space-y-4">
              {workExperiences.map((exp, index) => (
                <li key={index} className="border p-4 rounded-md">
                  <p className="font-semibold">
                    {exp.jobTitle} at {exp.employer}
                  </p>
                  <p className="text-sm text-gray-600">
                    {exp.startMonth} {exp.startYear} -{" "}
                    {exp.currentlyWorking
                      ? "Present"
                      : `${exp.endMonth} ${exp.endYear}`}
                  </p>
                  {exp.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Description:</strong> {exp.description}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            className="text-purple-600 hover:underline"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Next: Education
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkExperienceForm;
