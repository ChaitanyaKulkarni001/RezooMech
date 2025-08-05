import React, { useState, useEffect, useContext, useRef } from "react";
import AudioRecorder from "../Recordings/AudioRecorder";
import api from "../../api";
import { ThemeContext } from "../ThemeContext";

const AI_Interview = () => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiType, setAiType] = useState("ai-interview");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([
    "Tell me about yourself.",
    "Why should I hire you?",
    "What are your strengths?",
    "What are your weaknesses?",
    "Where do you see yourself in 5 years?",
    "Why do you want to work here?",
    "How do you handle stress and pressure?",
    "Describe a time when you faced a challenge and how you handled it.",
    "What is your greatest achievement?",
    "Why are you looking to leave your current job?",
  ]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef(null);

  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    setResponse(null);
    setQuestionIndex(0);
  }, [aiType]);

  useEffect(() => {
    // Auto-start voice playback when a new response is received
    if (response && !isSpeaking) {
      playVoice();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  const handleAudioSubmit = async (audioBlob) => {
    const audioFile = new File([audioBlob], "recorded_audio.wav", { type: "audio/wav" });
    const formData = new FormData();
    formData.append("audio", audioFile);
    formData.append("question", questions[questionIndex]);

    setLoading(true);
    try {
      const result = await api.post(`/api/${aiType}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResponse(result.data);
      setQuestionIndex((prevIndex) => prevIndex + 1);
    } catch (error) {
      console.error("Error:", error);
      alert("Your session got timeout due to inactivity. Please refresh the page and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResponse(null);
    setQuestionIndex(0);
  };

  const playVoice = () => {
    if (response) {
      // Combine transcription and analysis (adjust as needed)
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

  // Single toggle function
  const toggleVoice = () => {
    if (isSpeaking) {
      stopVoice();
    } else {
      playVoice();
    }
  };

  return (
    <div className={`max-w-3xl mx-auto mt-10 p-6 relative ${theme === 'dim' ? 'bg-white' : 'bg-gray-900'}`}>
      {/* Glowing Effect */}
      <div className="absolute inset-0 flex justify-center items-center">
        <div className={`w-full h-full rounded-full blur-3xl opacity-120px animate-pulse ${
          theme === 'dim'
            ? 'bg-gradient-to-r from-teal-300 via-blue-400 to-indigo-500'
            : 'bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-500'
        }`}></div>
      </div>

      <div className={`relative z-10 w-full max-w-2xl p-6 rounded-lg shadow-xl backdrop-blur-lg ${
        theme === 'dim' ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'
      }`}>
        <h1 className={`text-5xl ${theme==='dim' ? "text-black" : "text-white"} font-bold text-center mb-6 drop-shadow-lg`}>
          🎤 Practice
        </h1>

        <div className="question mt-4 text-xl font-medium drop-shadow-lg">
          <p>{questions[questionIndex]}</p>
        </div>

        <AudioRecorder onAudioSubmit={handleAudioSubmit} />

        {loading && <p className="text-center mt-4 animate-pulse">Processing...</p>}

        {response && (
          <div className={`response mt-6 p-4 rounded-lg shadow-lg ${theme === 'dim' ? 'bg-gray-100 text-gray-900' : 'bg-gray-800 text-white'}`}>
            <h2 className={`text-lg font-semibold ${theme=="dim"?"text-black":"text-white"} mb-2 drop-shadow-md`}>Analysis Result:</h2>
            <p>{response.transcription}</p>
            <p className="mt-2 text-green-500">{response.analysis}</p>
            {/* Single Toggle Button for Voice */}
            <div className="mt-4">
              <button
                onClick={toggleVoice}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200"
              >
                {isSpeaking ? "Stop Voice" : "Play Voice"}
              </button>
            </div>
          </div>
        )}

        {response && questionIndex < questions.length && (
          <button
            onClick={() => setQuestionIndex((prevIndex) => prevIndex + 1)}
            className={`w-full mt-6 py-2 text-lg font-semibold rounded-lg shadow-lg transition transform hover:scale-105 hover:shadow-xl ${
              theme === 'dim' ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'bg-gradient-to-r from-purple-600 to-blue-500 text-white'
            }`}
          >
            Next Question
          </button>
        )}

        {questionIndex >= questions.length && (
          <button
            onClick={handleReset}
            className={`w-full mt-6 py-2 text-lg font-semibold rounded-lg shadow-lg transition transform hover:scale-105 hover:shadow-xl ${
              theme === 'dim' ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white' : 'bg-gradient-to-r from-blue-600 to-indigo-500 text-white'
            }`}
          >
            Start Over
          </button>
        )}
      </div>
    </div>
  );
};

export default AI_Interview;
