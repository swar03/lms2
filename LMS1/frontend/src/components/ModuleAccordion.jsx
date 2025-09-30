import React, { useState } from 'react';
import { PlayCircleIcon, DocumentTextIcon, QuestionMarkCircleIcon, LinkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const ModuleAccordion = ({ module, progress, onPlayVideo, onOpenAssignment, onOpenQuiz }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border border-gray-700 rounded-lg mb-4 bg-gray-900 shadow-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-5 font-medium text-left text-white hover:bg-gray-800"
      >
        <span className="text-xl font-bold">{module.title}</span>
        <svg className={`w-6 h-6 transform transition-transform text-gray-400 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      {isOpen && (
        <div className="border-t border-gray-700">
          <ul className="divide-y divide-gray-700">
            {/* Lectures */}
            {module.lectures.map(item => (
              <li key={item.id} className="flex items-center justify-between p-4 hover:bg-gray-800">
                <div className="flex items-center">
                  {progress.lectures[item.id] ? <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" /> : <PlayCircleIcon className="h-6 w-6 text-indigo-400 mr-3" />}
                  <span className="text-gray-300">{item.title}</span>
                </div>
                <button onClick={() => onPlayVideo(item)} className="bg-indigo-600 text-white text-sm font-bold px-4 py-2 rounded-md hover:bg-indigo-500">Play</button>
              </li>
            ))}
            {/* Assignments */}
            {module.assignments.map(item => (
              <li key={item.id} className="flex items-center justify-between p-4 hover:bg-gray-800">
                <div className="flex items-center">
                   {progress.assignments[item.id] ? <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" /> : <DocumentTextIcon className="h-6 w-6 text-green-400 mr-3" />}
                  <span className="text-gray-300">{item.title}</span>
                </div>
                <button onClick={() => onOpenAssignment(item)} className="bg-green-600 text-white text-sm font-bold px-4 py-2 rounded-md hover:bg-green-500">
                  {progress.assignments[item.id] ? 'View Submission' : 'Details'}
                </button>
              </li>
            ))}
            {/* Quizzes */}
            {module.quizzes.map(item => (
              <li key={item.id} className="flex items-center justify-between p-4 hover:bg-gray-800">
                <div className="flex items-center">
                   {progress.quizzes[item.id] ? <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" /> : <QuestionMarkCircleIcon className="h-6 w-6 text-blue-400 mr-3" />}
                  <span className="text-gray-300">{item.title}</span>
                </div>
                 {progress.quizzes[item.id] ? (
                     <button onClick={() => onOpenQuiz(item)} className="text-sm font-bold py-2 px-4 rounded-md text-blue-300 hover:bg-gray-700">
                      Score: {progress.quizzes[item.id].score}/{progress.quizzes[item.id].total}
                    </button>
                  ) : (
                    <button onClick={() => onOpenQuiz(item)} className="bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-md hover:bg-blue-500">Start Quiz</button>
                  )}
              </li>
            ))}
            {/* Links */}
            {module.links.map(item => (
              <li key={item.id} className="flex items-center p-4 hover:bg-gray-800">
                <LinkIcon className="h-6 w-6 text-gray-400 mr-3" />
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ModuleAccordion;