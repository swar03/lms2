// client/src/components/MyLearnings.jsx (New File)

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, User, Percent } from 'lucide-react';

const API_URL = "http://localhost:5000";

const MyLearnings = () => {
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEnrolledCourses = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setError("You must be logged in to see your courses.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/api/my-courses`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setEnrolledCourses(response.data);
            } catch (err) {
                setError("Failed to load your courses. Please try again.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEnrolledCourses();
    }, []);

    if (loading) return <div className="text-center p-10">Loading your courses...</div>;
    if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

    return (
        <div className="bg-slate-100 min-h-screen">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-slate-800 mb-8">My Learnings</h1>

                {enrolledCourses.length === 0 ? (
                    <p className="text-slate-600">You are not enrolled in any courses yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {enrolledCourses.map(course => (
                            <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                                <img src={course.thumbnailUrl || 'https://placehold.co/600x400/3b82f6/ffffff?text=Course'} alt={course.title} className="w-full h-48 object-cover"/>
                                <div className="p-6">
                                    <h2 className="text-xl font-bold text-slate-800 mb-2">{course.title}</h2>
                                    <div className="flex items-center text-slate-500 text-sm mb-4">
                                        <User size={16} className="mr-2" />
                                        <span>{course.instructor.name}</span>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mb-4">
                                        <div className="flex justify-between text-sm text-slate-600 mb-1">
                                            <span>Progress</span>
                                            <span>{course.progress}%</span>
                                        </div>
                                        <div className="w-full bg-slate-200 rounded-full h-2.5">
                                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
                                        </div>
                                    </div>

                                    <button className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                        Continue Learning
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyLearnings;