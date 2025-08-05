import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import camera from "../../assets/camera.jpg";
import HelperMockInterview from './HelperMockInterview';
import { ThemeContext } from "../ThemeContext"; // Import your ThemeContext

const MockInterview = () => {
  const { theme } = useContext(ThemeContext); // Get the current theme
  const navigate = useNavigate();
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

  // Sample previous interviews (Replace with API data)
  const previousInterviews = [
    { id: 1, date: '2025-02-05', score: '85%', feedback: 'Good performance!' },
    { id: 2, date: '2025-02-03', score: '78%', feedback: 'Improve your confidence.' },
    { id: 3, date: '2025-01-28', score: '90%', feedback: 'Excellent answers!' },
    { id: 4, date: '2025-01-20', score: '70%', feedback: 'Need more structured answers.' },
    { id: 5, date: '2025-01-15', score: '88%', feedback: 'Solid preparation!' }
  ];

  // Define theme-based container classes
  const containerClasses =
    theme === "dim"
      ? "bg-gray-100 text-gray-900"
      : "bg-[#011638] text-white";

  return (
    <div className={`min-h-screen p-6 ${containerClasses}`}>
      {/* First Section: Info + Camera */}
      <div className={`flex md:flex-row ${theme === 'dim' ? 'bg-white' : 'bg-gray-800'} shadow-lg rounded-lg p-8 mb-6`}>
        {/* Left Side: Info & Button */}
        <div className={`w-full md:w-1/2 flex flex-col justify-center items-start text-left p-6  ${theme === 'dim' ? 'bg-white' : 'bg-gray-900'} shadow-lg rounded-lg border border-gray-200`}>
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-indigo-600 text-transparent bg-clip-text mb-4">
            Let's Get Started
          </h2>
          <div className="bg-gray-100 p-4 rounded-lg w-full mb-4">
            <p className="text-lg text-gray-800">
              <span className="font-bold">Job Role/Position:</span> Full Stack Developer
            </p>
            <p className="text-lg text-gray-800">
              <span className="font-bold">Tech Stack:</span> React, Java, Spring Boot, Node.js, MySQL
            </p>
            <p className="text-lg text-gray-800">
              <span className="font-bold">Years of Experience:</span> 2
            </p>
          </div>
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-md mb-4">
            <p className="text-yellow-800 font-semibold">
              📢 <span className="text-yellow-900">Information:</span> Enable your webcam and microphone to start the AI-generated mock interview. You will receive feedback based on your answers. <span className="font-bold">We never record your video.</span>
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard/mock-interview/start')}
            className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all transform hover:scale-105 hover:shadow-xl"
          >
            Start Interview
          </button>
        </div>
        {/* Right Side: Camera Section */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-4">
          {!cameraAccess ? (
            <>
              <img
                src={camera}
                alt="Camera Placeholder"
                className="rounded-lg shadow-md mb-4 w-full max-w-sm"
              />
              <button
                onClick={() => setCameraAccess(true)}
                className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
              >
                ALLOW ACCESS CAMERA IN NEXT STEP
              </button>
            </>
          ) : (
            <HelperMockInterview />
          )}
        </div>
      </div>

      {/* Second Section: Previous Interviews in Grid */}
      <div className={` ${theme === 'dim' ? 'bg-white' : 'bg-gray-800'}  shadow-lg rounded-lg p-8`}>
        <h2 className={`text-2xl font-bold   ${theme==='dim' ? "text-black" : "text-white"} mb-6 text-center`}>Previous Interviews</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {previousInterviews.length > 0 ? (
            previousInterviews.map((interview) => (
              <div
                key={interview.id}
                className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center text-center"
              >
                <p className="text-lg font-semibold text-gray-700">📅 {interview.date}</p>
                <p className="text-gray-600">🎯 Score: {interview.score}</p>
                <p className="text-gray-500 text-sm">📝 {interview.feedback}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-full">No previous interviews found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MockInterview;
