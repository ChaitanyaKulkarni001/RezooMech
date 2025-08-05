import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useDropzone } from "react-dropzone";
import api from '../../api';
import AudioRecorder from '../Recordings/AudioRecorder';
import { Volume2, CloudUpload, FileText, Clipboard, Check, Loader } from 'lucide-react';
import camera from "../../assets/camera.jpg";

const StartMockInterview = () => {
  // Toggle between manual form and resume extraction
  const [useResume, setUseResume] = useState(false);

  // === States for manual entry (existing form) ===
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [profession, setProfession] = useState('');
  const [customProfession, setCustomProfession] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [companySpecific, setCompanySpecific] = useState('no');
  const [companyName, setCompanyName] = useState('');
  const [customCompany, setCustomCompany] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [IsUploaded, setIsUploaded] = useState(false);

  // === States for resume extraction ===
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [resumeLoading, setResumeLoading] = useState(false);
  const [resumeCopied, setResumeCopied] = useState(false);

  // Common states for interview flow
  const [questions, setQuestions] = useState([]); // questions from the backend
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [response, setResponse] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);
  const [interviewEnded, setInterviewEnded] = useState(false);

  // Camera states
  const [cameraAccess, setCameraAccess] = useState(false);
  const videoRef = useRef(null);
  useEffect(() => {
    if (cameraAccess) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => console.error('Camera access denied:', err));
    }
  }, [cameraAccess]);

  // --- Resume Extraction using react-dropzone ---
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setResumeFile(acceptedFiles[0]);
      // Do not mark as uploaded yet; wait until extraction completes
      setIsUploaded(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "application/pdf",
    multiple: false,
  });

  const handleResumeUpload = async () => {
    if (!resumeFile) {
      alert("Please select or drop a PDF file.");
      return;
    }
    setResumeLoading(true);
    const formData = new FormData();
    formData.append("pdf", resumeFile);
    try {
      const response = await api.post("/api/extract-resume-text/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResumeText(response.data.text || "No text found in the PDF.");
      // Mark as uploaded so the button is removed
      setIsUploaded(true);
    } catch (error) {
      console.error("Error:", error);
      setResumeText("Error extracting text.");
    }
    setResumeLoading(false);
  };

  const handleResumeCopy = () => {
    navigator.clipboard.writeText(resumeText);
    setResumeCopied(true);
    setTimeout(() => setResumeCopied(false), 2000);
  };

  // --- Common handleSubmit to start the interview ---
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    // If using resume extraction, ensure text has been extracted
    if (useResume && !resumeText) {
      alert("Please extract your resume text before proceeding.");
      return;
    }
    setIsFormOpen(false);
    const formData = new FormData();
    formData.append('isMock', true);
    
    if (useResume) {
      formData.append('additionalInfo', resumeText);
    } else {
      formData.append('profession', profession === 'Other' ? customProfession : profession);
      formData.append('experienceLevel', experienceLevel);
      formData.append('yearsOfExperience', experienceLevel === 'experienced' ? yearsOfExperience : '0');
      formData.append('companySpecific', companySpecific === 'yes');
      formData.append(
        'companyName',
        companySpecific === 'yes' ? (companyName === 'Other' ? customCompany : companyName) : 'General'
      );
      formData.append('additionalInfo', additionalInfo);
    }

    try {
      const response = await api.post('/api/specific-role-interview/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Assume questions come as a numbered string like "1. ... 2. ..." 
      const questionsArray = response.data.question.split(/\d+\.\s/).filter(q => q.trim() !== "");
      setQuestions(questionsArray);
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  };

  // --- Audio submission logic (unchanged) ---
  const handleAudioSubmit = async (audioBlob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob);
    formData.append("question", questions[currentQuestionIndex]);

    setLoading(true);
    try {
      const result = await api.post("/api/follow-up-interview/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // Remove any placeholder for the next question
      const cleanedAnalysis = removeNextQuestionFromAnalysis(result.data.analysis);
      setResponse(prev => [
        ...prev,
        {
          question: questions[currentQuestionIndex],
          transcription: result.data.transcription,
          analysis: cleanedAnalysis
        }
      ]);
      setFeedback(prev => [
        ...prev,
        {
          question: questions[currentQuestionIndex],
          transcription: result.data.transcription,
          analysis: cleanedAnalysis
        }
      ]);
      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setInterviewEnded(true);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Session timed out. Please refresh and try again.");
    } finally {
      setLoading(false);
    }
  };

  const removeNextQuestionFromAnalysis = (analysis) => {
    return analysis.replace(/\{\{\s*.*?\s*\}\}/, "").trim();
  };

  // --- Text-to-Speech ---
  const textToSpeech = (text) => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      alert('Sorry, your browser does not support text-to-speech.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4 py-10">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">🎤 Mock Interview</h1>

      {/* Option Toggle */}
      {isFormOpen && (
        <div className="mb-6 flex space-x-4">
          <button
            onClick={() => setUseResume(false)}
            className={`px-4 py-2 rounded ${!useResume ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
          >
            Manual Entry
          </button>
          <button
            onClick={() => setUseResume(true)}
            className={`px-4 py-2 rounded ${useResume ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
          >
            Upload Resume
          </button>
        </div>
      )}

      {/* Initial Form / Resume Extraction */}
      {isFormOpen && !useResume && (
        <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg border">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profession */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Profession</label>
              <select
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
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
                  className="mt-3 w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter your profession"
                  value={customProfession}
                  onChange={(e) => setCustomProfession(e.target.value)}
                  required
                />
              )}
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Experience Level</label>
              <select
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                required
              >
                <option value="">Select Experience Level</option>
                <option value="fresher">Fresher</option>
                <option value="experienced">Experienced</option>
              </select>
            </div>

            {/* Years of Experience */}
            {experienceLevel === "experienced" && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Years of Experience</label>
                <input
                  type="number"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                  value={yearsOfExperience}
                  onChange={(e) => setYearsOfExperience(e.target.value)}
                  min="0"
                  required
                />
              </div>
            )}

            {/* Company Specific Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Is this for a specific company?
              </label>
              <div className="flex items-center space-x-4 mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="yes"
                    checked={companySpecific === 'yes'}
                    onChange={() => setCompanySpecific('yes')}
                    className="form-radio text-blue-500 focus:ring-2 focus:ring-blue-400 transition duration-200"
                  />
                  <span className="ml-2">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="no"
                    checked={companySpecific === 'no'}
                    onChange={() => setCompanySpecific('no')}
                    className="form-radio text-blue-500 focus:ring-2 focus:ring-blue-400 transition duration-200"
                  />
                  <span className="ml-2">No</span>
                </label>
              </div>
            </div>

            {/* Company Name Field */}
            {companySpecific === 'yes' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Company Name</label>
                <select
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 p-2.5"
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
                {companyName === 'Other' && (
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

            {/* Additional Info */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Additional Information</label>
              <textarea
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                rows="4"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="Share any additional details"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
            >
              Start Interview
            </button>
          </form>
        </div>
      )}

      {isFormOpen && useResume && (
        <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg border">
          {/* Resume Extraction Area */}
          <div {...getRootProps()} className="w-full h-48 flex flex-col items-center justify-center border-2 border-dashed border-gray-400 bg-white rounded-lg cursor-pointer transition-all duration-300 hover:bg-gray-50">
            <input {...getInputProps()} />
            <CloudUpload className="w-16 h-16 text-blue-500 mb-3" />
            {isDragActive ? (
              <p className="text-blue-600 font-medium">Drop your PDF here...</p>
            ) : (
              <p className="text-gray-600">Drag & drop a resume or click to upload</p>
            )}
          </div>
          {resumeFile && (
            <div className="mt-4 p-3 bg-gray-200 rounded-lg flex items-center space-x-3">
              <FileText className="w-5 h-5 text-gray-600" />
              <p className="text-sm text-gray-700">{resumeFile.name}</p>
            </div>
          )}
          {resumeFile && !IsUploaded && (
            <button
              onClick={handleResumeUpload}
              className="mt-4 w-full px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300"
              disabled={resumeLoading}
            >
              {resumeLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Extracting...</span>
                </div>
              ) : (
                "Upload"
              )}
            </button>
          )}
          
          {/* Button to start interview once resume text is available */}
          <button
            onClick={handleSubmit}
            className="mt-6 w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
          >
            Start Interview
          </button>
        </div>
      )}

      {/* Interview UI */}
      {!isFormOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mt-10">
          {/* Questions Section */}
          <div className="p-6 bg-white rounded-xl shadow-lg">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {questions.map((question, index) => (
                <h2
                  key={index}
                  className={`p-2 rounded-full text-sm text-center cursor-pointer ${
                    activeQuestionIndex === index
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => setActiveQuestionIndex(index)}
                >
                  Question: {index + 1}
                </h2>
              ))}
            </div>

            {/* Active Question */}
            {!interviewEnded && (
              <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-sm">
                <p className="text-gray-700">{questions[activeQuestionIndex]}</p>
                <Volume2
                  className="cursor-pointer mt-2"
                  onClick={() => textToSpeech(questions[activeQuestionIndex])}
                />
                <AudioRecorder onAudioSubmit={handleAudioSubmit} />
                {loading && <p className="text-blue-500 text-center mt-4">Processing...</p>}
              </div>
            )}

            {/* Interview Feedback */}
            {interviewEnded && (
              <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold">Interview Feedback:</h3>
                {feedback.length > 0 ? (
                  feedback.map((fb, index) => (
                    <div key={index} className="mt-4 p-4 bg-white shadow-sm">
                      <h4 className="text-md font-semibold">Q: {fb.question}</h4>
                      <p className="text-gray-700">Your Response: {fb.transcription}</p>
                      <p className="text-green-500">AI's Analysis: {fb.analysis}</p>
                    </div>
                  ))
                ) : (
                  <p>No responses recorded.</p>
                )}
              </div>
            )}
          </div>

          {/* Camera Section */}
          <div className="p-6 bg-white rounded-xl shadow-lg flex flex-col items-center">
            {!cameraAccess ? (
              <>
                <img src={camera} alt="Camera" className="w-60 h-60 object-cover" />
                <button
                  onClick={() => setCameraAccess(true)}
                  className="mt-5 bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition"
                >
                  Allow Camera
                </button>
              </>
            ) : (
              <>
                <video ref={videoRef} autoPlay className="w-100 h-100 rounded-lg"></video>
                <button
                  onClick={() => {
                    setCameraAccess(false);
                    if (videoRef.current) {
                      let stream = videoRef.current.srcObject;
                      let tracks = stream?.getTracks();
                      tracks?.forEach(track => track.stop());
                      videoRef.current.srcObject = null;
                    }
                  }}
                  className="mt-5 bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 transition"
                >
                  Stop Camera
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StartMockInterview;