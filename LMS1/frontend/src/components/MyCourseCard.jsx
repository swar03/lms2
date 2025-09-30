import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/solid';

const MyCourseCard = ({ course, status }) => {
  const statusConfig = {
    accepted: {
      Icon: CheckCircleIcon,
      color: 'text-green-400',
      text: 'Enrolled',
      action: (
        <Link to={`/course/${course.id}`} className="block w-full text-center bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">
          Start Learning
        </Link>
      ),
    },
    pending: {
      Icon: ClockIcon,
      color: 'text-yellow-400',
      text: 'Pending Approval',
      action: <button disabled className="w-full bg-gray-600 text-gray-400 font-bold py-2 px-4 rounded-lg cursor-not-allowed">Waiting for Approval</button>,
    },
    declined: {
      Icon: XCircleIcon,
      color: 'text-red-400',
      text: 'Declined',
      action: <button disabled className="w-full bg-gray-600 text-gray-400 font-bold py-2 px-4 rounded-lg cursor-not-allowed">Contact Support</button>,
    },
  };

  const { Icon, color, text, action } = statusConfig[status] || {};

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
      <img src={course.imageUrl} alt={course.title} className="w-full h-40 object-cover" />
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center mb-2">
          <Icon className={`h-6 w-6 mr-2 ${color}`} />
          <span className={`font-semibold ${color}`}>{text}</span>
        </div>
        <h3 className="text-xl font-bold text-white">{course.title}</h3>
        <div className="mt-auto pt-4">{action}</div>
      </div>
    </div>
  );
};

export default MyCourseCard;