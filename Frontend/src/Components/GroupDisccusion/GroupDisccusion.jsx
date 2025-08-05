import React, { useState, useEffect, useRef, useContext } from "react";
import Lottie from "lottie-react";
import GirlAnimation from "../../assets/Animations/GirlAnimation.json";
import BoyAnimation1 from "../../assets/Animations/BoyAnimation.json";
import BoyAnimation2 from "../../assets/Animations/BoyAnimation2.json";
import AudioRecorder from "../Recordings/AudioRecorder";
import api from "../../api";
import { ThemeContext } from "../ThemeContext";

const participants = [
  { name: "Sanchita", animation: BoyAnimation1, voice: "Microsoft Mark - English (United States)" },
  { name: "Ankoor", animation: GirlAnimation, voice: "Microsoft George - English (United Kingdom)" },
  { name: "Chaitanya", animation: BoyAnimation2, voice: "Google UK English Female" },
];

const GroupDiscussion = () => {
  const { theme } = useContext(ThemeContext);
  const [topic, setTopic] = useState("");
  const [discussionStarted, setDiscussionStarted] = useState(false);
  const [history, setHistory] = useState("");
  const [responses, setResponses] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(300); // 5 minutes timer

  // NEW STATES FOR REAL-TIME SPEAKER FEEDBACK & SPEECH TOGGLE
  const [activeSpeaker, setActiveSpeaker] = useState(null);
  const [currentSentence, setCurrentSentence] = useState("");
  const [speechEnabled, setSpeechEnabled] = useState(true);

  // States for the Complaint form
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [complaintName, setComplaintName] = useState("");
  const [complaintReason, setComplaintReason] = useState("");
  const [complaintImg, setComplaintImg] = useState(null);
  const [complaintLoading, setComplaintLoading] = useState(false);

  const containerRef = useRef(null);

  // Fetch discussion topic on mount.
  useEffect(() => {
    const getTopic = async () => {
      try {
        const result = await api.get("api/group-discussion-topic/");
        setTopic(result.data.text);
      } catch (error) {
        console.error("Error fetching topic:", error);
      }
    };
    getTopic();
  }, []);

  // Fullscreen request when discussion starts.
  const goFullScreen = () => {
    if (containerRef.current && containerRef.current.requestFullscreen) {
      containerRef.current.requestFullscreen();
    }
  };

  // Timer effect: countdown when discussion is active.
  useEffect(() => {
    let interval = null;
    if (discussionStarted) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            stopDiscussion();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [discussionStarted]);

  // Start discussion: reset timer, go fullscreen.
  const startDiscussion = () => {
    setDiscussionStarted(true);
    setTimer(300);
    goFullScreen();
  };

  // Stop discussion: cancel TTS and exit fullscreen.
  const stopDiscussion = () => {
    setDiscussionStarted(false);
    window.speechSynthesis.cancel();
    setActiveSpeaker(null);
    setCurrentSentence("");
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  // Toggle Speech on/off.
  const toggleSpeech = () => {
    if (speechEnabled) {
      window.speechSynthesis.cancel();
      setSpeechEnabled(false);
    } else {
      setSpeechEnabled(true);
    }
  };

  // Handle audio submission and process the discussion responses.
  const handleAudioSubmit = async (audioBlob, transcription) => {
    const audioFile = new File([audioBlob], "recorded_audio.wav", { type: "audio/wav" });
    const formData = new FormData();
    formData.append("audio", audioFile);
    formData.append("history", history);
    formData.append("topic", topic);

    setLoading(true);
    try {
      const result = await api.post("api/group-discussion/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const data = JSON.parse(result.data.text.slice(7, -4));
      setResponses(data);

      setHistory((prev) => prev + "\nUser: " + transcription);

      // Play responses sequentially in real time.
      playResponsesSequentially(data);
    } catch (error) {
      console.error("Error processing audio:", error);
      alert("There was an error processing your audio. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Play TTS responses sequentially for each participant.
  const playResponsesSequentially = async (responses) => {
    for (const participant of participants) {
      const text = responses[participant.name];
      if (text) {
        setActiveSpeaker(participant.name);
        setCurrentSentence(text);
        if (speechEnabled) {
          await speakText(text, participant.voice);
        }
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
    setActiveSpeaker(null);
    setCurrentSentence("");
  };

  // Helper function to speak text using the SpeechSynthesis API.
  const speakText = (text, voiceName) => {
    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      if (voiceName) {
        const voices = window.speechSynthesis.getVoices();
        const selectedVoice = voices.find((v) => v.name === voiceName);
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      }
      utterance.onend = resolve;
      utterance.onerror = reject;
      window.speechSynthesis.speak(utterance);
    });
  };

  // Handle the submission of the complaint form.
  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    const complaintData = new FormData();
    complaintData.append("misbehaving_person", complaintName);
    complaintData.append("reason", complaintReason);
    if (complaintImg) {
      complaintData.append("image", complaintImg);
    }
    setComplaintLoading(true);
    try {
      await api.post("api/report-complaint", complaintData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Complaint submitted successfully!");
      setComplaintName("");
      setComplaintReason("");
      setComplaintImg(null);
      setShowComplaintForm(false);
    } catch (error) {
      console.error("Error submitting complaint:", error);
      alert("There was an error submitting your complaint. Please try again.");
    } finally {
      setComplaintLoading(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`w-full min-h-screen ${theme === "dim" ? "bg-white" : "bg-black"} transition-colors duration-500`}
    >
      {!discussionStarted ? (
        <div className={`flex flex-col items-center justify-center min-h-screen ${theme === "dim" ? "bg-white text-gray-800" : "bg-gray-800 text-white"}`}>
          <h1 className="text-5xl font-bold mb-6">Group Discussion</h1>
          <h2 className="text-3xl mb-8">Topic: {topic}</h2>
          <div className="flex space-x-4">
            <button
              onClick={startDiscussion}
              className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
            >
              Start Discussion
            </button>
            <button
              onClick={async () => {
                try {
                  const result = await api.get("api/group-discussion-topic/");
                  setTopic(result.data.text);
                  setHistory("");
                } catch (error) {
                  console.error("Error fetching topic:", error);
                }
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
            >
              New Topic
            </button>
          </div>
        </div>
      ) : (
        <div className="relative h-full">
          {/* Participant Animations */}
          <div className="flex justify-around pt-6">
            {participants.map((participant) => (
              <div key={participant.name} className="text-center transition-transform duration-300">
                <Lottie
                  animationData={participant.animation}
                  style={{
                    width: activeSpeaker === participant.name ? 400 : 250,
                    height: activeSpeaker === participant.name ? 400 : 250,
                  }}
                />
                <h3 className="mt-2 text-2xl font-semibold">{participant.name}</h3>
              </div>
            ))}
          </div>

          {/* Active Response Chat Bubble */}
          {activeSpeaker && currentSentence && (
            <div className="absolute top-1/3 right-4 p-6 bg-white rounded-lg shadow-lg w-1/3">
              <h2 className="text-2xl font-bold text-right mb-2">{activeSpeaker} says:</h2>
              <p className="text-xl italic text-right">{currentSentence}</p>
            </div>
          )}

          {/* Audio Recorder, Timer & Speech Toggle */}
          <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center">
            <div className="mb-4 text-2xl font-bold">
              Time Remaining: {Math.floor(timer / 60)}:
              {("0" + (timer % 60)).slice(-2)}
            </div>
            <AudioRecorder onAudioSubmit={handleAudioSubmit} />
            {loading && <p className="text-blue-500 mt-2">Processing your audio...</p>}
            <div className="mt-4 flex space-x-4">
              <button
                onClick={toggleSpeech}
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg shadow-md transition-colors"
              >
                {speechEnabled ? "Stop Speech" : "Start Speech"}
              </button>
              <button
                onClick={stopDiscussion}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow-md transition-colors"
              >
                Stop Discussion
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complaint Form Modal */}
      {showComplaintForm && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-96">
            <h2 className="text-2xl font-bold mb-4">Report a Complaint</h2>
            <form onSubmit={handleComplaintSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Name of Misbehaving Person:</label>
                <input
                  type="text"
                  value={complaintName}
                  onChange={(e) => setComplaintName(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Reason:</label>
                <textarea
                  value={complaintReason}
                  onChange={(e) => setComplaintReason(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Upload Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setComplaintImg(e.target.files[0])}
                  className="w-full"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowComplaintForm(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-700 hover:bg-red-800 text-white py-2 px-4 rounded"
                  disabled={complaintLoading}
                >
                  {complaintLoading ? "Submitting..." : "Submit Complaint"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDiscussion;
