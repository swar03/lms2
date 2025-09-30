import React from 'react';

const CourseCard = ({ course, onRequestEnroll, status }) => {
  const isUpcoming = course.status === 'upcoming';

  const getButtonState = () => {
    if (isUpcoming) return { text: 'Coming Soon', disabled: true, className: 'bg-blue-800 cursor-not-allowed' };
    if (status === 'accepted') return { text: 'Enrolled', disabled: true, className: 'bg-gray-600 cursor-not-allowed' };
     if (status === 'available') return { text: 'Enrolled', disabled: true, className: 'bg-gray-600 cursor-not-allowed' };
    if (status === 'pending') return { text: 'Pending Approval', disabled: true, className: 'bg-yellow-600 cursor-not-allowed' };
    return { text: 'Request Enroll', disabled: false, className: 'bg-indigo-600 hover:bg-indigo-500' };
  };

  const { text, disabled, className } = getButtonState();

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 flex flex-col h-full">
      <div className="relative">
        <img src={course.imageUrl} alt={course.title} className="w-full h-48 object-cover" />
        {isUpcoming && <div className="absolute top-3 right-3 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-md">UPCOMING</div>}
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
        <p className="text-gray-400 mb-4 flex-grow">{course.description}</p>
        <button
          onClick={() => !disabled && onRequestEnroll(course.id)}
          disabled={disabled}
          className={`w-full text-white font-bold py-2 px-4 rounded-lg mt-auto transition-colors ${className}`}
        >
          {text}
        </button>
      </div>
    </div>
  );
};

export default CourseCard;