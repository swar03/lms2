import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { allCourses } from '../data/mockData';
import CourseCard from '../components/CourseCard';
import MyCourseCard from '../components/MyCourseCard';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [courseStatuses, setCourseStatuses] = useState({
    c2: 'accepted',
    c3: 'pending',
    c8: 'declined',
  });

  const handleEnrollRequest = (courseId) => {
    setCourseStatuses(prev => ({ ...prev, [courseId]: 'pending' }));
    toast.success('Enrollment request submitted!');
  };

  const myCourses = allCourses.filter(course => courseStatuses[course.id]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="bg-gray-900 rounded-lg shadow-lg p-6 mb-12">
        <h1 className="text-3xl font-bold text-white">Welcome back, {user?.name}!</h1>
        <p className="text-gray-400 mt-2">Continue your learning journey and sharpen your skills.</p>
      </div>

      {/* My Courses Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">My Courses</h2>
        {myCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {myCourses.map(course => (
              <MyCourseCard key={course.id} course={course} status={courseStatuses[course.id]} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-900 p-8 rounded-lg text-center text-gray-500">
            <p>You haven't enrolled in any courses yet. Explore the catalog below to get started!</p>
          </div>
        )}
      </section>

      {/* Course Catalog Section */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6">Course Catalog</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allCourses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              onRequestEnroll={handleEnrollRequest}
              status={courseStatuses[course.id]}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default StudentDashboard;