import { useState, useEffect } from 'react';

export default function QuizInterface({ quiz, onSubmit, onClose }) {
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(null);

  // Sample quiz questions (in real app, this would come from quiz.questions)
  const questions = quiz.questions || [
    {
      id: 1,
      type: 'multiple-choice',
      question: 'What does OS stand for?',
      options: ['Operating System', 'Open Source', 'Online Service', 'Optical Storage'],
      correct: 'Operating System'
    },
    {
      id: 2,
      type: 'multiple-choice',
      question: 'Which of the following is a network protocol?',
      options: ['HTTP', 'CPU', 'RAM', 'GPU'],
      correct: 'HTTP'
    },
    {
      id: 3,
      type: 'text',
      question: 'Explain what a firewall does in network security.',
      correct: null
    }
  ];

  // Timer (30 minutes for quiz)
  useEffect(() => {
    if (timeLeft === null) {
      setTimeLeft(30 * 60); // 30 minutes in seconds
    }

    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmit(); // Auto-submit when time runs out
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          quizId: quiz.id,
          answers: Object.values(answers)
        })
      });

      if (response.ok) {
        const result = await response.json();
        onSubmit?.(result);
        onClose?.();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to submit quiz');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = questions.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white">{quiz.title}</h3>
            <p className="text-sm text-gray-400">
              {answeredCount}/{totalQuestions} questions answered
            </p>
          </div>
          <div className="text-right">
            {timeLeft !== null && (
              <div className={`text-lg font-mono ${timeLeft < 300 ? 'text-red-400' : 'text-yellow-400'}`}>
                ⏱️ {formatTime(timeLeft)}
              </div>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white ml-4"
            >
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((question, index) => (
            <div key={question.id} className="bg-gray-700 rounded-lg p-4">
              <div className="mb-3">
                <span className="text-blue-400 text-sm font-medium">
                  Question {index + 1}
                </span>
                <h4 className="text-white font-medium mt-1">{question.question}</h4>
              </div>

              {question.type === 'multiple-choice' ? (
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <label
                      key={optionIndex}
                      className="flex items-center space-x-3 cursor-pointer hover:bg-gray-600 p-2 rounded"
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option}
                        checked={answers[question.id] === option}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-300">{option}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <textarea
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              )}
            </div>
          ))}

          {error && (
            <div className="text-red-400 text-sm bg-red-900 bg-opacity-20 p-3 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-600">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || answeredCount === 0}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium"
            >
              {submitting ? 'Submitting...' : `Submit Quiz (${answeredCount}/${totalQuestions})`}
            </button>
          </div>
        </form>

        <div className="mt-4 text-xs text-gray-500 text-center">
          Quiz will auto-submit when time expires
        </div>
      </div>
    </div>
  );
}