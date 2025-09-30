import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import apiService from '../services/api';
import { 
  UsersIcon, 
  AcademicCapIcon, 
  ChartBarIcon,
  UserGroupIcon,
  BookOpenIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalModules: 0,
    totalLectures: 0,
    totalAssignments: 0,
    totalQuizzes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [users, courses, modules, lectures, assignments, quizzes] = await Promise.all([
        apiService.getUsers(),
        apiService.getCourses(),
        apiService.getModules(),
        apiService.getLectures(),
        apiService.getAssignments(),
        apiService.getQuizzes()
      ]);

      setStats({
        totalUsers: users.length,
        totalCourses: courses.length,
        totalModules: modules.length,
        totalLectures: lectures.length,
        totalAssignments: assignments.length,
        totalQuizzes: quizzes.length
      });
    } catch (error) {
      toast.error('Failed to fetch dashboard statistics');
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: UsersIcon,
      color: 'bg-blue-600',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Courses',
      value: stats.totalCourses,
      icon: BookOpenIcon,
      color: 'bg-green-600',
      textColor: 'text-green-600'
    },
    {
      title: 'Total Modules',
      value: stats.totalModules,
      icon: AcademicCapIcon,
      color: 'bg-purple-600',
      textColor: 'text-purple-600'
    },
    {
      title: 'Total Lectures',
      value: stats.totalLectures,
      icon: ChartBarIcon,
      color: 'bg-indigo-600',
      textColor: 'text-indigo-600'
    },
    {
      title: 'Total Assignments',
      value: stats.totalAssignments,
      icon: ClipboardDocumentListIcon,
      color: 'bg-yellow-600',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Total Quizzes',
      value: stats.totalQuizzes,
      icon: UserGroupIcon,
      color: 'bg-red-600',
      textColor: 'text-red-600'
    }
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="bg-gray-900 rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400 mt-2">Welcome back, {user?.name}!</p>
        <p className="text-gray-500 text-sm mt-1">System overview and statistics</p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={index}
              className="bg-gray-900 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-900 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            Manage Users
          </button>
          <button className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            Create Course
          </button>
          <button className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            View Reports
          </button>
          <button className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            System Settings
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-900 rounded-lg shadow-lg p-6 mt-8">
        <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No recent activity to display</p>
          <p className="text-gray-500 text-sm mt-2">Activity logs will appear here</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
