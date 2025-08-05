import React, { useState, useEffect } from "react";
import api from "../../api";

const CreateQuiz = () => {
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("");
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await api.get("/api/get-quiz-data/");
      console.log("Fetched Questions:", response.data);
      setQuestions(response.data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleQuestionSelection = (questionId) => {
    setSelectedQuestions((prevSelected) =>
      prevSelected.includes(questionId)
        ? prevSelected.filter((id) => id !== questionId)
        : [...prevSelected, questionId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !language || selectedQuestions.length === 0) {
      alert("Please fill all fields and select at least one question.");
      return;
    }

    try {
      await api.post("/api/quiz/", {
        title,
        language,
        question_ids: selectedQuestions,
      });
      alert("Quiz created successfully!");
      setTitle("");
      setLanguage("");
      setSelectedQuestions([]);
    } catch (error) {
      console.error("Error creating quiz:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Create a New Quiz</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Quiz Title Field */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Quiz Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter quiz title"
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring focus:border-blue-500 transition duration-200"
            />
          </div>

          {/* Language Field */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Language</label>
            <input
              type="text"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="Enter language"
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring focus:border-blue-500 transition duration-200"
            />
          </div>

          {/* Questions Selection */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">Select Questions</h3>
            {questions.length > 0 ? (
              <ul className="space-y-2 max-h-72 overflow-y-auto border border-gray-200 p-3 rounded-lg">
                {questions.map((q) => (
                  <li key={q.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedQuestions.includes(q.id)}
                      onChange={() => handleQuestionSelection(q.id)}
                      className="h-5 w-5 text-blue-600 border-gray-300 rounded"
                    />
                    <span className="text-gray-700">{q.text}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No questions available.</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 transition duration-200"
          >
            Create Quiz
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateQuiz;
