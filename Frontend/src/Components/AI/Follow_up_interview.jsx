import React, { useContext, useState, useEffect, useRef } from "react";
import AudioRecorder from "../Recordings/AudioRecorder";  // Assuming this is already implemented
import api from "../../api";
import { ThemeContext } from "../ThemeContext";

const Follow_up_interview = () => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("Tell me about yourself");
  const [showInfo, setShowInfo] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef(null);
  const { theme } = useContext(ThemeContext);

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
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Extract and clean the next question from the analysis
      const nextQuestion = extractNextQuestion(result.data.analysis);
      const cleanedAnalysis = removeNextQuestionFromAnalysis(result.data.analysis);

      setResponse({ ...result.data, analysis: cleanedAnalysis });
      setCurrentQuestion(nextQuestion);  // Set the next question for the follow-up
    } catch (error) {
      console.error("Error:", error);
      alert("Your session got timeout due to inactivity. Please refresh the page and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Voice playback functions
  const playVoice = () => {
    if (response) {
      const textToSpeak = `${response.transcription}. ${response.analysis}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utteranceRef.current = utterance;
      speechSynthesis.speak(utterance);
      setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
    }
  };

  const stopVoice = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // Single toggle function for voice
  const toggleVoice = () => {
    if (isSpeaking) {
      stopVoice();
    } else {
      playVoice();
    }
  };

  // Auto-start voice playback when a new response is received
  useEffect(() => {
    if (response && !isSpeaking) {
      playVoice();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 relative rounded-xl shadow-lg text-white">
      {/* Glowing Effect */}
      <div className="absolute inset-0 flex justify-center items-center">
        <div className={`w-full h-full rounded-full blur-3xl opacity-120px animate-pulse ${
          theme === 'dim'
            ? 'bg-gradient-to-r from-teal-300 via-blue-400 to-indigo-500'
            : 'bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-500'
        }`}></div>
      </div>

      <div className={`relative z-10 p-6 rounded-xl ${theme === 'dim' ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'}`}>
        {/* Title */}
        <h1 className={`text-3xl font-bold mb-4 ${theme==="dim"?"text-black":"text-white"}  `}>
          🎤 Follow-Up Interview
        </h1>

        {/* Info Icon and description toggle */}
        <div
          className="flex items-center justify-end mb-4 relative"
          onMouseEnter={() => setShowInfo(true)}
          onMouseLeave={() => setShowInfo(false)}
        >
          <span className="w-6 h-6 cursor-pointer">ℹ️</span>
          {showInfo && (
            <div className="absolute bg-gray-900 text-white text-xs rounded px-2 py-1 bottom-8 left-1/2 transform -translate-x-1/2">
              The AI will ask a series of questions, and based on your answers, provide relevant follow-up questions.
            </div>
          )}
        </div>

        {/* Current Question */}
        <p className="mb-4">{currentQuestion}</p>

        {/* Audio Recorder */}
        <AudioRecorder onAudioSubmit={handleAudioSubmit} />

        {loading && <p className="text-blue-400 text-center mt-4">Processing...</p>}

        {response && (
          <>
            <div className="response mt-6 p-4 rounded-lg bg-gray-800 shadow-sm">
              {/* User's Response (Transcription) */}
              <h2 className="text-lg font-semibold mb-2 text-gray-300">Your Response:</h2>
              <p className="text-gray-400">{response.transcription}</p>

              {/* AI's Analysis (Cleaned without next question) */}
              <h2 className="text-lg font-semibold mb-2 mt-4 text-green-400">AI's Analysis:</h2>
              <p className="text-green-300">{response.analysis.slice(19, -6)}</p>

              {/* Next Question */}
              <h2 className="text-lg font-semibold mb-2 mt-4 text-blue-400">Next Question:</h2>
              <p className="text-blue-300">{currentQuestion}</p>
            </div>

            {/* Single Voice Toggle Button */}
            <div className="mt-4">
              <button
                onClick={toggleVoice}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200"
              >
                {isSpeaking ? "Stop Voice" : "Play Voice"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Follow_up_interview;
