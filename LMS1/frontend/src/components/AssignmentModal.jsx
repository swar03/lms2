import React, { useState } from 'react';

const AssignmentModal = ({ assignment, submission, onClose, onSubmit }) => {
  const [textSubmission, setTextSubmission] = useState('');
  
  if (!assignment) return null;

  const hasSubmitted = !!submission;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl text-gray-900"> {/* Added text-gray-900 */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{assignment.title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 font-bold text-3xl">&times;</button>
        </div>
        <p className="text-gray-600 mb-4">{assignment.description}</p>
        
        {hasSubmitted ? (
          <div>
            <h3 className="font-semibold mb-2 text-gray-800">Your Submission:</h3> {/* Added text color */}
            <pre className="bg-gray-100 p-4 rounded-md whitespace-pre-wrap text-gray-800">{submission.content}</pre> {/* Added text color */}
            <p className="text-green-600 font-medium mt-4">Status: {submission.status}</p>
          </div>
        ) : (
          <div>
            <textarea
              className="w-full p-2 border rounded-md text-gray-800 bg-white" /* Added text and bg color */
              rows="5"
              placeholder="Type your answer here..."
              value={textSubmission}
              onChange={(e) => setTextSubmission(e.target.value)}
            ></textarea>
            <div className="mt-4 flex justify-end">
              <button onClick={() => onSubmit(assignment.id, textSubmission)} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700">
                Submit Assignment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentModal;