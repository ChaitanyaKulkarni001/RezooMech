import { useState } from "react";

const ProjectForm = ({ onBack, onNext, onSave }) => {
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState({
    title: "",
    role: "",
    description: "",
    startMonth: "",
    startYear: "",
    endMonth: "",
    endYear: "",
    currentlyOngoing: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProject((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    // Add the current project to the list.
    setProjects([...projects, project]);
    // Reset the project form.
    setProject({
      title: "",
      role: "",
      description: "",
      startMonth: "",
      startYear: "",
      endMonth: "",
      endYear: "",
      currentlyOngoing: false,
    });
  };

  const handleNext = () => {
    // If current project entry isn't empty, add it to the list.
    const isEmpty = project.title.trim() === "";
    const allProjects = !isEmpty ? [...projects, project] : projects;
    onSave(allProjects);
    onNext();
  };

  const handleBack = () => {
    onBack();
  };

  return (
    <div className="w-full px-4 py-6">
      <h2 className="text-2xl font-bold text-center mb-2">Projects</h2>
      <p className="text-center text-gray-600 mb-6">
        Add your project details below.
      </p>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto">
        <form onSubmit={handleAddProject} className="grid gap-6">
          {/* Project Title & Role */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="title"
              placeholder="Project Title"
              value={project.title}
              onChange={handleChange}
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="role"
              placeholder="Your Role in the Project"
              value={project.role}
              onChange={handleChange}
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Project Description */}
          <textarea
            name="description"
            placeholder="Project Description"
            value={project.description}
            onChange={handleChange}
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          ></textarea>

          {/* Start Date Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="startMonth"
              value={project.startMonth}
              onChange={handleChange}
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Start Month</option>
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <input
              type="number"
              name="startYear"
              placeholder="Year"
              value={project.startYear}
              onChange={handleChange}
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* End Date Fields (conditionally shown) */}
          {!project.currentlyOngoing && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                name="endMonth"
                value={project.endMonth}
                onChange={handleChange}
                className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">End Month</option>
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <input
                type="number"
                name="endYear"
                placeholder="Year"
                value={project.endYear}
                onChange={handleChange}
                className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Checkbox for Currently Ongoing */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="currentlyOngoing"
              checked={project.currentlyOngoing}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-gray-600">This project is ongoing</label>
          </div>

          {/* Add Project Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Project
            </button>
          </div>
        </form>

        {/* Display Added Projects */}
        {projects.length > 0 && (
          <div className="bg-gray-100 p-6 rounded-md shadow-md mt-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Added Projects</h3>
            <ul className="space-y-4">
              {projects.map((proj, index) => (
                <li key={index} className="border p-4 rounded-md">
                  <p className="font-semibold">
                    {proj.title} - {proj.role}
                  </p>
                  <p className="text-sm text-gray-600">
                    {proj.startMonth} {proj.startYear} -{" "}
                    {proj.currentlyOngoing ? "Present" : `${proj.endMonth} ${proj.endYear}`}
                  </p>
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
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectForm;
