import React, { useState, useContext } from 'react';
import api from '../../api'; // Ensure the correct import for your Axios instance
import AudioRecorder from '../Recordings/AudioRecorder';
import TextToSpeech from "../Recordings/Helper/TextToSpeech";
import { ThemeContext } from "../ThemeContext"; // Import your ThemeContext

const SituationalQuestions = () => {
  const { theme } = useContext(ThemeContext);

  const [isFormOpen, setIsFormOpen] = useState(true);
  const [profession, setProfession] = useState('');
  const [customProfession, setCustomProfession] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [companySpecific, setCompanySpecific] = useState('no');
  const [companyName, setCompanyName] = useState('');
  const [customCompany, setCustomCompany] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(question);
  const [showInfo, setShowInfo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [requestxtrainfo, setrequestxtrainfo] = useState("");

  // Container background based on theme
  const containerClasses =
    theme === "dim"
      ? "bg-gray-100 text-gray-900"  // Light mode
      : "bg-[#011638] text-white";    // Dark mode

  // Card background & border based on theme
  const cardBgClasses =
    theme === "dim"
      ? "bg-white border border-gray-100"
      : "bg-gray-800 border border-gray-700";

  // Card text color based on theme
  const cardTextClasses =
    theme === "dim" ? "text-gray-900" : "text-white";

  // Glow gradient (purple-blue style, same for both themes, or tweak if you want different colors per theme)
  // You can also differentiate the gradient for dim vs. dark, if desired.
  const glowGradient = 
    "bg-gradient-to-r from-purple-600 via-blue-500 to-purple-700";

  // Extract the next question from the analysis text (between double curly braces)
  const extractNextQuestion = (analysis) => {
    const match = analysis.match(/\{\{\s*(.*?)\s*\}\}/);
    return match ? match[1] : "Could you please elaborate more?";
  };

  // Remove the next question from the analysis text
  const removeNextQuestionFromAnalysis = (analysis) => {
    return analysis.replace(/\{\{\s*.*?\s*\}\}/, "").trim();
  };

  const handleAudioSubmit = async (audioBlob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob);
    formData.append("question", currentQuestion);

    setLoading(true);
    try {
      const result = await api.post("/api/follow-up-interview/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Extract and clean the next question from the analysis
      const nextQuestion = extractNextQuestion(result.data.analysis);
      const cleanedAnalysis = removeNextQuestionFromAnalysis(result.data.analysis);

      setResponse({ ...result.data, analysis: cleanedAnalysis });
      setCurrentQuestion(nextQuestion); // Set the next question for the follow-up
    } catch (error) {
      console.error("Error:", error);
      alert("Your session got timeout due to inactivity. Please refresh the page and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsFormOpen(false);

    const formData = new FormData();
    formData.append("IsSituationalQuestion", true);
    formData.append(
      "AdditionalInfo",
      "I am a " +
        profession +
        " with " +
        experienceLevel +
        " experience of " +
        yearsOfExperience +
        " years. I am looking for a job in " +
        companyName +
        ". Extra Info is " +
        additionalInfo
    );

    try {
      const response = await api.post("/api/generate-random-question/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setQuestion(response.data.question);
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className={`min-h-screen p-4 ${containerClasses}`}>
      {/* Card Wrapper with reduced max-width */}
      <div className="relative max-w-3xl mx-auto mt-10">
        {/* Glow layer behind the entire card */}
        <div className="absolute inset-0 z-[-1] flex justify-center items-center pointer-events-none">
          <div
            className={`w-full h-full rounded-2xl blur-3xl opacity-75 ${glowGradient}`}
          ></div>
        </div>

        {/* Actual Card Content */}
        <div
          className={`relative z-10 p-4 sm:p-5 rounded-2xl shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl ${cardBgClasses} ${cardTextClasses}`}
        >
          {/* Title */}
          <h1 className={`text-3xl font-bold text-center mb-6 ${theme === "dim" ? "text-gray-900" : "text-white"}`}>
            🎤 Situation-Based Interview
          </h1>

          {isFormOpen && (
            <form
              onSubmit={handleSubmit}
              className={`mt-4 space-y-4 p-4 rounded-2xl shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl ${
                theme === "dim" ? "bg-white text-gray-900" : "bg-gray-800 text-white"
              }`}
            >
              {/* Profession Field */}
              <div>
                <label className="block text-sm font-semibold mb-1">Profession</label>
                <select
                  className={`mt-1 block w-full rounded-lg ${theme=="dim"?"text-black":"text-black"} border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 p-2.5`}
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  required
                >
                  <option value="">Select Profession</option>
                  <option value="Developer">Developer</option>
                  <option value="Tester">Tester</option>
                  <option value="Designer">Designer</option>
                  <option value="Other">Other</option>
                </select>
                {profession === "Other" && (
                  <input
                    type="text"
                    className="mt-3 text-black w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                    placeholder="Enter your profession"
                    value={customProfession}
                    onChange={(e) => setCustomProfession(e.target.value)}
                    required
                  />
                )}
              </div>

              {/* Experience Level Field */}
              <div>
                <label className="block text-sm font-semibold mb-1">Experience Level</label>
                <select
                  className="mt-1 block w-full text-black rounded-lg border-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 p-2.5"
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  required
                >
                  <option value="">Select Experience Level</option>
                  <option value="fresher">Fresher</option>
                  <option value="experienced">Experienced</option>
                </select>
              </div>

              {/* Years of Experience Field */}
              {experienceLevel === "experienced" && (
                <div>
                  <label className="block text-sm font-semibold mb-1">Years of Experience</label>
                  <input
                    type="number"
                    className="mt-1 w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                    value={yearsOfExperience}
                    onChange={(e) => setYearsOfExperience(e.target.value)}
                    min="0"
                    required
                  />
                </div>
              )}

              {/* Company Specific Field */}
              <div>
                <label className="block text-sm font-semibold mb-1">Is this for a specific company?</label>
                <div className="flex items-center space-x-4 mt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="yes"
                      checked={companySpecific === "yes"}
                      onChange={() => setCompanySpecific("yes")}
                      className="form-radio bg-black text-blue-500 focus:ring-2 focus:ring-blue-400 transition duration-200"
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="no"
                      checked={companySpecific === "no"}
                      onChange={() => setCompanySpecific("no")}
                      className="form-radio text-blue-500 focus:ring-2 focus:ring-blue-400 transition duration-200"
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
              </div>

              {/* Company Name Field */}
              {companySpecific === "yes" && (
                <div>
                  <label className="block text-sm font-semibold mb-1">Company Name</label>
                  <select
                    className="mt-1 block w-full rounded-lg text-black border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 p-2.5"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  >
                    <option value="">Select Company</option>
                    <option value="TCS">TCS</option>
                    <option value="Capegemini">Capegemini</option>
                    <option value="Wipro">Wipro</option>
                    <option value="Infosys">Infosys</option>
                    <option value="Other">Other</option>
                  </select>
                  {companyName === "Other" && (
                    <input
                      type="text"
                      className="mt-3 w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                      placeholder="Enter company name"
                      value={customCompany}
                      onChange={(e) => setCustomCompany(e.target.value)}
                      required
                    />
                  )}
                </div>
              )}

              {/* Additional Information Field */}
              <div>
                <label className="block text-sm font-semibold mb-1">Additional Information</label>
                <textarea
                  className="mt-1 text-black w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                  rows="4"
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder="Share any additional details"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition duration-200 shadow-md hover:shadow-lg"
              >
                Submit
              </button>
            </form>
          )}

          {question && (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800">
                Generated Interview Question:
              </h3>
              <p className="mt-2 text-gray-700">{question}</p>

              <div className="follow-up-interview-container max-w-3xl mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-gray-50">
                <div
                  className="flex items-center justify-end mb-4 relative"
                  onMouseEnter={() => setShowInfo(true)}
                  onMouseLeave={() => setShowInfo(false)}
                >
                  <span className="w-6 h-6 cursor-pointer">ℹ</span>
                  {showInfo && (
                    <div className="absolute bg-black text-white text-xs rounded px-2 py-1 bottom-8 left-1/2 transform -translate-x-1/2">
                      The AI will ask a series of questions, and based on your answers and information
                    </div>
                  )}
                </div>

                <p className="text-lg font-semibold mb-4">{currentQuestion}</p>
                <AudioRecorder onAudioSubmit={handleAudioSubmit} />
                {loading && (
                  <p className="text-blue-500 text-center mt-4">Processing...</p>
                )}

                {response && (
                  <>
                    <TextToSpeech text={response.analysis} />
                    <div className="response mt-6 p-4 border rounded-lg bg-white shadow-sm">
                      <h2 className="text-lg font-semibold mb-2">Your Response:</h2>
                      <p className="text-gray-700">{response.transcription}</p>

                      <h2 className="text-lg font-semibold mb-2 mt-4">AI's Analysis:</h2>
                      <p className="text-green-500">
                        {response.analysis.slice(19, -6)}
                      </p>

                      <h2 className="text-lg font-semibold mb-2 mt-4">Next Question:</h2>
                      <p className="text-blue-500">{currentQuestion}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SituationalQuestions;
