import { useState } from "react";

const SkillsForm = ({ onBack, onNext, onSave }) => {
  const [skills, setSkills] = useState([]);
  const [currentSkill, setCurrentSkill] = useState("");

  // When user presses space or Enter, add the current skill if it's not empty.
  const handleKeyDown = (e) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      if (currentSkill.trim() !== "") {
        setSkills([...skills, currentSkill.trim()]);
        setCurrentSkill("");
      }
    }
  };

  // Remove a skill from the list.
  const removeSkill = (indexToRemove) => {
    setSkills(skills.filter((_, index) => index !== indexToRemove));
  };

  // Pass the skills to parent component and proceed.
  const handleNext = () => {
    onSave(skills);
    onNext(skills);
  };

  const handleBack = () => {
    onBack();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-3xl w-full">
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Skills</h2>
        <p className="text-gray-600 mb-6">
          Type a skill and press space or Enter to add it. You can remove a skill by clicking the × button.
        </p>

        {/* Skills Input */}
        <div className="border rounded-md p-2 mb-4">
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <div key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center">
                <span>{skill}</span>
                <button
                  onClick={() => removeSkill(index)}
                  className="ml-2 text-blue-500 hover:text-blue-700"
                >
                  &times;
                </button>
              </div>
            ))}
            <input
              type="text"
              className="flex-1 min-w-[150px] outline-none"
              placeholder="Type a skill..."
              value={currentSkill}
              onChange={(e) => setCurrentSkill(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button className="text-purple-600" onClick={handleBack}>
            ← Back
          </button>
          <button 
            type="button" 
            onClick={handleNext} 
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Next: Summary
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillsForm;
