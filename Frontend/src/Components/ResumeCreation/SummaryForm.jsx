import { useState } from "react";
import api from "../../api";

const SummaryForm = ({ resumeData, onBack, onNext, onSave }) => {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    onSave(summary);
    onNext(summary);
  };

  const handleBack = () => {
    onBack();
  };

  const handleGetAISummary = async () => {
    setLoading(true);
    try {
      // Prepare resume data to send to the AI endpoint.
      const formData = new FormData();
      console.log("Resume Data:", resumeData);
      formData.append("data", JSON.stringify(resumeData || {}));
      const result = await api.post("api/get-summary-resume/", formData);
      if (result.data && result.data.text) {
        setSummary(result.data.text);
        // Save the AI-generated summary immediately.
        onSave(result.data.text);
      }
    } catch (error) {
      console.error("Error generating AI summary", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-3xl w-full">
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Professional Summary</h2>
        <p className="text-gray-600 mb-6">
          Write a brief summary highlighting your experience, skills, and achievements.
          You may also generate a summary with AI based on your resume data.
        </p>

        {/* Summary Input */}
        <textarea
          className="w-full h-32 p-2 border rounded-md outline-none resize-none"
          placeholder="Enter your professional summary..."
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        ></textarea>

        {/* AI Summary Button */}
        <div className="flex justify-end mt-2">
          <button
            type="button"
            onClick={handleGetAISummary}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            {loading ? "Generating Summary..." : "Generate AI Summary"}
          </button>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button className="text-purple-600 hover:underline" onClick={handleBack}>
            ← Back
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Next: Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryForm;
