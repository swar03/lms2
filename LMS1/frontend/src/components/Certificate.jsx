import React from 'react';

const Certificate = ({ courseTitle, studentName, completionDate }) => {
  return (
    <div 
      id="certificate" 
      className="relative bg-gradient-to-br from-gray-900 to-gray-700 p-12 border-4 border-yellow-500 w-full max-w-4xl aspect-[1.414/1] rounded-lg shadow-2xl overflow-hidden text-white flex flex-col justify-between"
    >
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <pattern id="pattern-zigzag" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M0 10L10 0L20 10L10 20L0 10Z" fill="#374151"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#pattern-zigzag)" />
        </svg>
      </div>

      <div className="relative z-10 text-center flex-grow flex flex-col justify-center">
        <h1 className="text-5xl font-extrabold font-serif text-yellow-400 mb-4 animate-fade-in" style={{ animationDelay: '0.0s' }}>Certificate of Completion</h1>
        <p className="text-xl mt-4 text-gray-200 animate-fade-in" style={{ animationDelay: '0.2s' }}>This is to certify that</p>
        <p className="text-4xl font-bold text-indigo-400 my-6 animate-fade-in-scale" style={{ animationDelay: '0.4s' }}>{studentName}</p>
        <p className="text-xl text-gray-200 animate-fade-in" style={{ animationDelay: '0.6s' }}>has successfully completed the course</p>
        <p className="text-3xl font-semibold my-6 text-yellow-300 animate-fade-in-scale" style={{ animationDelay: '0.8s' }}>{courseTitle}</p>
        <p className="text-lg text-gray-300 animate-fade-in" style={{ animationDelay: '1.0s' }}>on {completionDate}</p>
      </div>
      
      <div className="relative z-10 flex justify-between items-end mt-12 text-gray-300">
        <div className="animate-fade-in-slide-up" style={{ animationDelay: '1.2s' }}>
          <p className="border-t-2 border-gray-500 px-4 pt-2 font-medium">Instructor Signature</p>
        </div>
        <div className="animate-fade-in-slide-up" style={{ animationDelay: '1.4s' }}>
          {/* Using a simple text logo for now, replace with an actual logo if available */}
          <p className="text-2xl font-bold text-indigo-400">CyberLMS</p>
          <p className="text-sm text-gray-400">Awarding Body</p>
        </div>
      </div>
    </div>
  );
};

export default Certificate;