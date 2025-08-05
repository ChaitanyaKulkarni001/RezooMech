import React, { useState, useCallback,useContext } from "react";
import { useDropzone } from "react-dropzone";
import api from "../../api"; // Adjust the path based on your project structure
import { CloudUpload, FileText, Loader, Volume2, VolumeX } from "lucide-react";
import { ThemeContext } from "../ThemeContext";
function ResumeChecker() {
  const [file, setFile] = useState(null);
  const theme = useContext(ThemeContext)
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Handle file drop
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "application/pdf",
    multiple: false,
  });

  // Handle file upload using your API instance
  const handleUpload = async () => {
    if (!file) {
      alert("Please select or drop a PDF file.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const res = await api.post("/api/extract-resume/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }); 
      setResponseData(res.data);
    } catch (error) {
      console.error("Error:", error);
      setResponseData({
        Pros: "",
        Cons: "",
        LatexCode: "Error extracting details.",
      });
    }
    setLoading(false);
  };

  // Handle text-to-speech for Pros and Cons
  const handleSpeechToggle = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else if (responseData) {
      const speechText = `Pros: ${responseData.Pros}. Cons: ${responseData.Cons}.`;
      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <div className= {` ${theme==='dim'?"bg-gray-700":"bg-blue"}  min-h-screen text-white flex flex-col items-center justify-center p-6  `}>
      {/* Heading */}
      <div className="mb-8 text-center">
        <h1 className={`text-4xl font-extrabold tracking-wide`}>
          <p className={`${ theme=="dim"?"text-white":"text-black" } `}>Resume Analyzer</p>
        </h1>
        <p className="mt-2 text-lg text-gray-300">
          Upload your resume and extract insights
        </p>
      </div>

      {/* Drag & Drop Area */}
      <div
        {...getRootProps()}
        className="w-full max-w-2xl h-64 flex flex-col items-center justify-center border-2 border-dashed border-blue-500 bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 cursor-pointer relative overflow-hidden"
      >
        <input {...getInputProps()} />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-20 blur-sm pointer-events-none"></div>
        <CloudUpload className="w-16 h-16 mb-3 text-blue-300" />
        {isDragActive ? (
          <p className="text-blue-300 font-semibold">Drop your PDF here...</p>
        ) : (
          <p className="text-gray-300">
            Drag & drop a resume or click to upload
          </p>
        )}
      </div>

      {/* File Selection */}
      {file && (
        <div className="mt-4 p-3 bg-gray-800 rounded-lg flex items-center space-x-3 shadow-md">
          <FileText className="w-5 h-5 text-blue-300" />
          <p className="text-sm">{file.name}</p>
        </div>
      )}

      {/* Upload Button */}
      {file && (
        <button
          onClick={handleUpload}
          className="mt-4 px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transition duration-300 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <Loader className="w-5 h-5 animate-spin" />
              <span>Extracting...</span>
            </div>
          ) : (
            "Upload & Extract"
          )}
        </button>
      )}

      {/* Display Response */}
      {responseData && (
        <div className="mt-8 w-full max-w-3xl p-6 bg-gray-800 border border-blue-500 rounded-xl shadow-lg">
         <  p className={`text-2xl font-bold mb-4 ${theme === 'dim' ? 'text-white' : 'text-white'}`}>
  Analysis Result:
</p>

          <div className="space-y-4">
            <p className="text-lg">
              <span className="font-semibold text-blue-300">Pros:</span>{" "}
              {responseData.Pros}
            </p>
            <p className="text-lg">
              <span className="font-semibold text-blue-300">Cons:</span>{" "}
              {responseData.Cons}
            </p>
            <div>
              <p className="text-lg font-semibold text-blue-300">LaTeX Code:</p>
              <pre className="mt-2 p-4 bg-gray-900 border border-gray-700 rounded text-sm whitespace-pre-wrap overflow-x-auto">
                {responseData.LatexCode}
              </pre>
            </div>
          </div>
          {/* Voice Toggle for Pros and Cons */}
          <button
            onClick={handleSpeechToggle}
            className="mt-6 px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition duration-300 rounded-full shadow-lg flex items-center focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            {isSpeaking ? (
              <VolumeX className="w-5 h-5 mr-2" />
            ) : (
              <Volume2 className="w-5 h-5 mr-2" />
            )}
            {isSpeaking ? "Stop Voice" : "Play Voice (Pros & Cons)"}
          </button>
        </div>
      )}
    </div>
  );
}

export default ResumeChecker;
