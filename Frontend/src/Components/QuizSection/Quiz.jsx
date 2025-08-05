import React, { useState, useEffect } from "react";
import api from "../../api";

const Quiz = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [timer, setTimer] = useState(90); // 90 seconds per question
    const [quizStarted, setQuizStarted] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);

    // Fetch questions
    const handleQuiz = async () => {
        const result = await api.get("/api/get-apti-questions/");
        setQuestions(result.data);
        setQuizStarted(true);
        setCurrentQuestionIndex(0);
        setScore(0);
        setShowResult(false);
        setSelectedAnswer(null);
        setTimer(90);
        setShowExplanation(false);
    };

    // Timer effect
    useEffect(() => {
        if (quizStarted && timer > 0) {
            const interval = setInterval(() => {
                setTimer((prevTime) => prevTime - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else if (timer === 0) {
            handleNextQuestion(); // Auto move to next question if time is up
        }
    }, [timer, quizStarted]);

    // Handle answer selection
    const handleAnswerClick = (optionKey) => {
        setSelectedAnswer(optionKey);
        setShowExplanation(true);

        if (optionKey === questions[currentQuestionIndex].correct_answer) {
            setScore(score + 1);
        }
    };

    // Move to next question
    const handleNextQuestion = () => {
        if (currentQuestionIndex + 1 < questions.length) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer(null);
            setTimer(90);
            setShowExplanation(false);
        } else {
            setShowResult(true);
        }
    };

    return (
        <div className="min-h-screen bg-gray-800 flex flex-col items-center justify-center ">
            <div className="bg-gray-900 shadow-lg rounded-lg p-6 w-full max-w-2xl">
                <h1 className="text-3xl text-white font-bold text-center mb-4">Quiz</h1>

                {!quizStarted ? (
                    <button
                        onClick={handleQuiz}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 w-full text-lg"
                    >
                        Start Quiz
                    </button>
                ) : showResult ? (
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold">Quiz Completed!</h2>
                        <p className="text-lg mt-2">Your Score: {score} / {questions.length}</p>
                        <button
                            onClick={handleQuiz}
                            className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
                        >
                            Restart Quiz
                        </button>
                    </div>
                ) : (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl text-white    font-semibold">
                                Question {currentQuestionIndex + 1} / {questions.length}
                            </h2>
                            <p className="text-red-500 font-bold">⏳ {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}</p>
                        </div>

                        <p className="text-lg mb-4">{questions[currentQuestionIndex].question}</p>

                        <div className="grid gap-3 text-black">
                            {Object.entries(questions[currentQuestionIndex].options).map(([key, value]) => (
                                <button
                                    key={key}
                                    onClick={() => handleAnswerClick(key)}
                                    className={`w-full px-4 py-2 border rounded-lg text-left text-lg 
                                        ${selectedAnswer === key 
                                            ? key === questions[currentQuestionIndex].correct_answer 
                                                ? "bg-green-500 text-white border-green-600"
                                                : "bg-red-500 text-white border-red-600" 
                                            : "bg-gray-100 hover:bg-gray-200"
                                        }`}
                                    disabled={selectedAnswer !== null} // Disable buttons after selection
                                >
                                    {key}: {value}
                                </button>
                            ))}
                        </div>

                        {showExplanation && (
                            <div className="mt-4 p-4 bg-gray-50 border-l-4 border-blue-400">
                                <p className="text-blue-700"><strong>Explanation:</strong> {questions[currentQuestionIndex].explanation}</p>
                                <button
                                    onClick={handleNextQuestion}
                                    className="mt-3 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 w-full"
                                >
                                    Next Question
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Quiz;
