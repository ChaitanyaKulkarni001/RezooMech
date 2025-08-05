import React, { useState, useEffect,useContext } from "react";
import AudioRecorder from "../Recordings/AudioRecorder";
import api from "../../api";
import TextToSpeech from "../Recordings/Helper/TextToSpeech";
import { ThemeContext } from "../ThemeContext";
const OneMinuteQuestion = () => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [question, setQuestion] = useState("First Year College Friends");

  const generateRandomQuestion = async () => {
    try {
      const result = await api.post("/api/generate-random-question/");
      setQuestion(result.data.question);
    } catch (err) {
      console.error("Error fetching question:", err);
      alert("Your session has been timed out. Please refresh the page and try again.");
    }
  };

  useEffect(() => {
    generateRandomQuestion();
  }, []);

  const handleAudioSubmit = async (audioBlob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob);
    formData.append("question", question);

    setLoading(true);
    try {
      const result = await api.post("/api/one-minute-question/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResponse(result.data);
    } catch (error) {
      console.error("Error submitting audio:", error);
      alert("An error occurred while processing your response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = () => {
    setResponse(null);
    setTimeLeft(60);
    generateRandomQuestion();
  };
  const { theme } = useContext(ThemeContext);

 return (
  <div className="max-w-xl mx-auto mt-10 p-6 relative rounded-2xl shadow-lg">
    {/* Glowing Effect */}
    <div className="absolute inset-0 flex justify-center items-center">
      <div className={`w-full h-full rounded-full blur-3xl opacity-80 animate-pulse ${
        theme === 'dim'
          ? 'bg-gradient-to-r from-cyan-300 via-blue-400 to-teal-500'  // Softer glow for light mode
          : 'bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-500' // Stronger glow for dark mode
      }`}></div>
    </div>

    {/* Main Card */}
    <div className={`relative z-10 p-6 rounded-2xl ${
      theme === 'dim'
        ? 'bg-gray-100 text-gray-800 shadow-md'  // Light theme: Softer background & text
        : 'bg-gray-900 text-white shadow-lg'     // Dark theme: Deep black background
    }`}>
      {/* Title */}
      <h1 className={`text-4xl font-bold mb-4 ${
        theme === "dim" ? "text-gray-900" : "text-white"
      }`}>
        🎤 One-Minute Interview
      </h1>

      {/* Question */}
      <p className="mb-3 font-medium text-lg">{question}</p>

      {/* Audio Recorder */}
      <AudioRecorder onAudioSubmit={handleAudioSubmit} timeLimit={60} />

      {/* Processing Indicator */}
      {loading && <p className="text-blue-500 text-center mt-4">Processing...</p>}

      {/* Response & Analysis */}
      {response && (
        <>
          <TextToSpeech text={response.analysis} />
          <div className={`response mt-6 p-4 rounded-lg ${
            theme === 'dim' ? 'bg-white shadow-md' : 'bg-gray-800 shadow-sm'
          }`}>
            {/* User's Response */}
            <h2 className={`text-lg font-semibold mb-2 ${
              theme === 'dim' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              Your Response:
            </h2>
            <p className={`{${theme === 'dim' ? 'text-gray-600' : 'text-gray-400'}`}>
              {response.transcription}
            </p>

            {/* AI's Analysis */}
            <h2 className={`text-lg font-semibold mb-2 mt-4 ${
              theme === 'dim' ? 'text-green-600' : 'text-green-400'
            }`}>
              AI's Analysis:
            </h2>
            <p className={`${theme === 'dim' ? 'text-green-500' : 'text-green-300'}`}>
              {response.analysis}
            </p>
          </div>
        </>
      )}

      {/* Next Question Button */}
      <button 
        onClick={handleNextQuestion} 
        className={`mt-4 w-full py-2 px-4 rounded-lg font-semibold shadow-md transition duration-200 ${
          theme === 'dim'
            ? 'bg-blue-500 hover:bg-blue-600 text-white'  // Lighter blue in light mode
            : 'bg-blue-600 hover:bg-blue-700 text-white'  // Darker blue in dark mode
        }`}
      >
        Next Question
      </button>
    </div>
  </div>
);

};

export default OneMinuteQuestion;
