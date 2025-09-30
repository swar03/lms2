import React, { useState } from 'react';

const QuizModal = ({ quiz, result, onClose, onSubmit }) => {
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  if (!quiz) return null;

  const handleAnswerChange = (questionId, optionIndex) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = () => {
    let score = 0;
    quiz.questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        score++;
      }
    });
    onSubmit(quiz.id, score, quiz.questions.length);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Show results screen
  if (result) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Quiz Results</h2>
          <p className="text-xl mb-6 text-gray-700">
            You scored{" "}
            <span className="font-bold text-indigo-600">{result.score}</span> out of{" "}
            <span className="font-bold">{result.total}</span>!
          </p>
          <button
            onClick={onClose}
            className="bg-indigo-600 text-white font-bold py-2 px-6 rounded hover:bg-indigo-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Current question
  const question = quiz.questions[currentQuestionIndex];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">{quiz.title}</h2>

        {/* Question */}
        <div>
          <p className="font-semibold mb-4 text-gray-900">
            Q{currentQuestionIndex + 1}. {question.text}
          </p>
          <div className="space-y-2">
            {question.options.map((opt, index) => (
              <label
                key={index}
                className={`flex items-center p-2 rounded-md cursor-pointer ${
                  answers[question.id] === index ? "bg-indigo-100" : "hover:bg-gray-100"
                } text-gray-700`}
              >
                <input
                  type="radio"
                  name={question.id}
                  checked={answers[question.id] === index}
                  onChange={() => handleAnswerChange(question.id, index)}
                  className="mr-3"
                />
                {opt}
              </label>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-300"
          >
            Cancel
          </button>

          <div className="flex space-x-3">
            {currentQuestionIndex > 0 && (
              <button
                onClick={handlePrevious}
                className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-400"
              >
                Previous
              </button>
            )}

            {currentQuestionIndex < quiz.questions.length - 1 ? (
              <button
                onClick={handleNext}
                className="bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700"
              >
                Submit Quiz
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizModal;
