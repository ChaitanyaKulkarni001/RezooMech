import React, { useState, useEffect,useRef } from "react";
import api from "../../api";
import "../../App.css"
// Language mapping with placeholder logo paths
const languages = [
  { id: 1, name: "Python", logo: "https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg" },
  { id: 2, name: "Java", logo: "https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg" },
  { id: 3, name: "C", logo: "https://raw.githubusercontent.com/devicons/devicon/master/icons/cplusplus/cplusplus-original.svg" },
  { id: 4, name: "C++", logo: "https://raw.githubusercontent.com/devicons/devicon/master/icons/c/c-original.svg" },
];

const getHeaderColor = (language) => {
  switch (language) {
    case "Python": return "bg-yellow-500";
    case "Java": return "bg-red-500";
    case "C": return "bg-blue-500";
    case "C++": return "bg-indigo-500";
    default: return "bg-gray-500";
  }
};

const getProblemCount = (language) => {
  switch (language) {
    case "Python": return 133;
    case "Java": return 181;
    case "C": return 173;
    case "C++": return 206;
    default: return 100;
  }
};

const getLanguageDescription = (language) => {
  switch (language) {
    case "Python": return "Solve Python coding problems online.";
    case "Java": return "Complete your Java coding practice.";
    case "C": return "Improve your C programming skills.";
    case "C++": return "Solve C++ practice problems.";
    default: return "Learn and practice coding.";
  }
};

const CodeQuiz = () => {
  // State management
  const [aiAskHistory, setAiAskHistory] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(60);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [AIResponse, setAIResponse] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const divRef = useRef(null);
  // New states for chat functionality
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  
  const handleFullScreen = () => {
    if (divRef.current) {
      if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
        setIsFullscreen(false);
      } else {
        if (divRef.current.requestFullscreen) {
          divRef.current.requestFullscreen();
        } else if (divRef.current.webkitRequestFullscreen) {
          divRef.current.webkitRequestFullscreen();
        } else if (divRef.current.mozRequestFullScreen) {
          divRef.current.mozRequestFullScreen();
        } else if (divRef.current.msRequestFullscreen) {
          divRef.current.msRequestFullscreen();
        }
        setIsFullscreen(true);
      }
    }
  };
  
  useEffect(() => {
    if (selectedLanguage && quizData && divRef.current) {
      handleFullScreen();
    }
  }, [selectedLanguage, quizData]);
  
  // Timer countdown effect (resets when question changes)
  useEffect(() => {
    let interval = null;
    // Only run timer if quiz is active and chat is not open.
    if (selectedLanguage && quizData && !showResults && !isChatOpen) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev > 0) return prev - 1;
          else {
            // When time runs out and no answer is selected, auto-skip
            if (selectedAnswer === null) {
              handleSkip();
            }
            return 60;
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [selectedLanguage, quizData, currentQuestionIndex, showResults, selectedAnswer, isChatOpen]);

  // Fetch quiz data from the API using axios
  const fetchQuizData = async (langId, page = 1) => {
    try {
      const response = await api.get(
        `api/get-quiz-data/?language=${langId}&page=${page}`
      );
      setQuizData(response.data);
      setCurrentQuestionIndex(0);
      setTimer(60); // Reset timer for new page/questions
      setSelectedAnswer(null);
    } catch (error) {
      console.error("Error fetching quiz data:", error);
    }
  };

  // Handle language selection
  const handleLanguageSelect = (langId) => {
    setSelectedLanguage(langId);
    fetchQuizData(langId, 1);
    handleFullScreen();
  };

  // Save the selected answer (evaluation happens on "Next Question" click)
  const handleAnswer = (optionKey) => {
    if (selectedAnswer !== null) return; // Prevent changing answer once selected
    setSelectedAnswer(optionKey);
  };

  // Handle moving to the next question and evaluating the answer
  const handleNext = () => {
    const currentQuestion = quizData.results[currentQuestionIndex];
    console.log("Selected Answer:", selectedAnswer);
    console.log("Correct Answer:", currentQuestion.correct_answer);
    if (selectedAnswer === currentQuestion.correct_answer) {
      setScore((prevScore) => prevScore + 1);
    }
    goToNextQuestion();
  };

  // Handle skipping a question (when no answer is selected)
  const handleSkip = () => {
    goToNextQuestion();
  };

  // Common function to move to the next question or page
  const goToNextQuestion = () => {
    setSelectedAnswer(null);
    if (currentQuestionIndex < quizData.results.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setTimer(60);
    } else if (quizData.next) {
      const url = new URL(quizData.next);
      const nextPage = url.searchParams.get("page");
      setCurrentPage(parseInt(nextPage));
      fetchQuizData(selectedLanguage, nextPage);
    } else {
      setShowResults(true);
    }
  };

  // Allow users to jump to any question on the current page using the pagination indicator.
  const handlePageIndicatorClick = (index) => {
    setCurrentQuestionIndex(index);
    setTimer(60);
    setSelectedAnswer(null);
  };

  // New function to handle sending a chat message and calling the API
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userQuery = chatInput.trim();
    // Append user's message to chat history
    setChatHistory((prev) => [...prev, { from: "user", text: userQuery }]);
    // Clear the input field
    setChatInput("");

    // Build the payload using the current question details
    const currentQuestion = quizData.results[currentQuestionIndex];
    const formData = new FormData();
    formData.append("UserQuery", userQuery);
    formData.append("currentQuestion", currentQuestion.statement);
    // Stringify options if needed
    formData.append("currentOptions", JSON.stringify(currentQuestion.options));
    formData.append("currentCorrectAnswer", currentQuestion.correct_answer);
    formData.append("currentExplanation", currentQuestion.explanation);
    formData.append("currentTopic", currentQuestion.topic);
    formData.append("aiAskHistory", JSON.stringify([...aiAskHistory, userQuery]));
    // Update the AI ask history
    setAiAskHistory((prev) => [...prev, userQuery]);

    try {
      const result = await api.post("api/ai-ask/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const aiText = result.data.text;
      // Append AI's response to chat history
      setChatHistory((prev) => [...prev, { from: "ai", text: aiText }]);
      setAIResponse(aiText);
      console.log("AI Response:", aiText);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setChatHistory((prev) => [
        ...prev,
        { from: "ai", text: "Error fetching response" },
      ]);
    }
  };

  const restartQuiz = () => {
    setSelectedLanguage(null);
    setQuizData(null);
    setCurrentPage(1);
    setCurrentQuestionIndex(0);
    setTimer(60);
    setScore(0);
    setSelectedAnswer(null);
    setShowResults(false);
  };

  // Show quiz results if completed
  if (showResults) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h2 className="text-3xl font-bold mb-4">Quiz Results</h2>
        <p className="text-xl mb-4">Your Score: {score}</p>
        <button
          onClick={restartQuiz}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Restart Quiz
        </button>
      </div>
    );
  }

  // If no language is selected, show the language selection view.
  if (!selectedLanguage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-4xl font-bold mb-8">Choose a Language</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {languages.map((lang) => (
            <div
              key={lang.id}
              onClick={() => handleLanguageSelect(lang.id)}
              className="cursor-pointer bg-white shadow-md rounded-lg border border-gray-300 hover:shadow-xl transition transform hover:-translate-y-1"
            >
              {/* Header Bar (Top Section with Different Colors) */}
              <div className={`h-3 rounded-t-lg ${getHeaderColor(lang.name)}`}></div>

              {/* Content Inside the Card */}
              <div className="p-6 flex flex-col items-center text-center">
                <img src={lang.logo} alt={lang.name} className="w-12 h-12 mb-3" />
                <h3 className="text-lg font-semibold">{lang.name}</h3>
                <p className="text-sm text-gray-600 mt-2">
                  {getLanguageDescription(lang.name)}
                </p>

                {/* Footer Section for Difficulty & Problems Count */}
                <div className="mt-4 flex justify-between items-center w-full text-sm text-gray-500">
                  <span>🔢 {getProblemCount(lang.name)} Problems</span>
                  <span>⚡ Beginner</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
    );
  }

  // If the language is selected but the quiz data hasn't loaded yet
  if (!quizData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading quiz...</p>
      </div>
    );
  }

  // Current question from the fetched data
  const currentQuestion = quizData.results[currentQuestionIndex];
  const isLastQuestion =
    currentQuestionIndex === quizData.results.length - 1 && !quizData.next;
  const nextButtonLabel = isLastQuestion ? "Show Results" : "Next Question";

  return (
    <div ref={divRef}   className="min-h-screen bg-gray-50 p-4 relative">
      {/* Header: Quiz title, topic, timer, and pagination */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold">
            Quiz on{" "}
            {languages.find((lang) => lang.id === selectedLanguage)?.name}
          </h2>
          <p className="text-sm text-gray-600">Topic: {currentQuestion.topic}</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Timer */}
          
          <div className="bg-blue-500 text-white px-4 py-2 rounded-lg">
            {timer}s
           
<div onClick={()=>{alert("You have Paused the quiz")}} class="circle-button">
  <svg
    class="icon"
    stroke-linejoin="round"
    stroke-linecap="round"
    stroke-width="2"
    stroke="currentColor"
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"></path>
    <path d="M12 6v6l3 3"></path>
  </svg>
</div>

          </div>
          {/* Pagination indicators */}
          <div className="flex space-x-1">
            {quizData.results.map((_, index) => (
              <div
                key={index}
                onClick={() => handlePageIndicatorClick(index)}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs cursor-pointer ${
                  index === currentQuestionIndex
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Question Section */}
      <div className="bg-white shadow-md rounded-lg p-10 mb-10">
        <h3 className="text-xl font-semibold mb-2">
          {currentQuestion.statement}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(currentQuestion.options).map(([key, option]) => (
            <button
              key={key}
              onClick={() => handleAnswer(key)}
              className={`cursor-pointer transition-all 
                px-6 py-2 rounded-lg border-b-[4px] 
                hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] 
                active:border-b-[2px] active:brightness-90 active:translate-y-[2px] 
                ${selectedAnswer === key
                  ? "bg-green-500 text-white border-green-600"
                  : "bg-blue-500 text-white border-blue-600"}
              `}
            >
              <strong>{key}.</strong> {option}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Section */}
      <div className="flex justify-between">
        {selectedAnswer !== null ? (
          
          /* From Uiverse.io by Javierrocadev */ 
<button onClick={handleNext} class="group group-hover:before:duration-500 group-hover:after:duration-500 after:duration-500 hover:border-rose-300 hover:before:[box-shadow:_20px_20px_20px_30px_#a21caf] duration-500 before:duration-500 hover:duration-500 underline underline-offset-2 hover:after:-right-8 hover:before:right-12 hover:before:-bottom-8 hover:before:blur hover:underline hover:underline-offset-4  origin-left hover:decoration-2 hover:text-rose-300 relative bg-neutral-800 h-16 w-64 border text-left p-3 text-gray-50 text-base font-bold rounded-lg  overflow-hidden  before:absolute before:w-12 before:h-12 before:content[''] before:right-1 before:top-1 before:z-10 before:bg-violet-500 before:rounded-full before:blur-lg  after:absolute after:z-10 after:w-20 after:h-20 after:content['']  after:bg-rose-300 after:right-8 after:top-3 after:rounded-full after:blur-lg">
 {nextButtonLabel}
</button>


        ) : (
          /* From Uiverse.io by Javierrocadev */ 
<button onClick={()=> setIsChatOpen((prev) => !prev)} class="group group-hover:before:duration-500 group-hover:after:duration-500 after:duration-500 hover:border-rose-300 hover:before:[box-shadow:_20px_20px_20px_30px_#a21caf] duration-500 before:duration-500 hover:duration-500 underline underline-offset-2 hover:after:-right-8 hover:before:right-12 hover:before:-bottom-8 hover:before:blur hover:underline hover:underline-offset-4  origin-left hover:decoration-2 hover:text-rose-300 relative bg-neutral-800 h-16 w-64 border text-left p-3 text-gray-50 text-base font-bold rounded-lg  overflow-hidden  before:absolute before:w-12 before:h-12 before:content[''] before:right-1 before:top-1 before:z-10 before:bg-violet-500 before:rounded-full before:blur-lg  after:absolute after:z-10 after:w-20 after:h-20 after:content['']  after:bg-rose-300 after:right-8 after:top-3 after:rounded-full after:blur-lg">
 ASK AI
</button>


        )}
        {/* AI 1Ask Button: toggles chat open/close */}
        
        
          
          {/* /* From Uiverse.io by shivam_7937 */  }
<div onClick={handleSkip} class="relative inline-flex items-center justify-center gap-4 group">
  <div
    class="absolute inset-0 duration-1000 opacity-60 transitiona-all bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 rounded-xl blur-lg filter group-hover:opacity-100 group-hover:duration-200"
  ></div>
  <a
    role="button"
    class="group relative inline-flex items-center justify-center text-base rounded-xl bg-gray-900 px-8 py-3 font-semibold text-white transition-all duration-200 hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-gray-600/30"
    title="payment"
    href="#"
    >Skip Quesiton<svg
      aria-hidden="true"
      viewBox="0 0 10 10"
      height="10"
      width="10"
      fill="none"
      class="mt-0.5 ml-2 -mr-1 stroke-white stroke-2"
    >
      <path
        d="M0 5h7"
        class="transition opacity-0 group-hover:opacity-100"
      ></path>
      <path
        d="M1 1l4 4-4 4"
        class="transition group-hover:translate-x-[3px]"
      ></path>
    </svg>
  </a>
</div>
      </div>

          

      {/* Chat Box: rendered at the bottom if open */}
      {isChatOpen && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-bold">Chat with AI</h4>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-red-500 font-bold"
            >
              Close
            </button>
          </div>
          {/* Chat history */}
          <div className="max-h-40 overflow-y-auto mb-2 space-y-2">
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`${
                  msg.from === "user" ? "text-right" : "text-left"
                }`}
              >
                <span
                  className={`inline-block text-black p-2 rounded ${
                    msg.from === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-black"
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
          {/* Chat input */}
          <div className="flex bg-black ">
            <input 
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type your question..."
              className="flex-grow border p-2 text-black rounded-l focus:outline-none"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white p-2 rounded-r hover:bg-blue-600 transition"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeQuiz;
