// src/components/ProgressBar.jsx

import React from 'react';

const ProgressBar = ({ percentage }) => {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-base font-medium text-indigo-700">Course Progress</span>
        <span className="text-sm font-medium text-indigo-700">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;