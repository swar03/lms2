import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import apiService from '../services/api';
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

const ManagerDashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchPendingEnrollments();
    fetchNotifications();
  }, []);

  const fetchPendingEnrollments = async () => {
    try {
      const response = await apiService.getPendingEnrollments();
      setEnrollments(response.enrollments || []);
    } catch (error) {
      toast.error('Failed to fetch pending enrollments');
      console.error('Error fetching enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await apiService.getNotifications();
      setNotifications(response.notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleApprove = async (enrollmentId) => {
    try {
      await apiService.approveEnrollment(enrollmentId);
      toast.success('Enrollment approved successfully');
      fetchPendingEnrollments();
      fetchNotifications();
    } catch (error) {
      toast.error('Failed to approve enrollment');
      console.error('Error approving enrollment:', error);
    }
  };

  const handleDeny = async (enrollmentId) => {
    try {
      await apiService.denyEnrollment(enrollmentId);
      toast.success('Enrollment denied');
      fetchPendingEnrollments();
      fetchNotifications();
    } catch (error) {
      toast.error('Failed to deny enrollment');
      console.error('Error denying enrollment:', error);
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      await apiService.markNotificationAsRead(notificationId);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

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
        <h1 className="text-3xl font-bold text-white">Manager Dashboard</h1>
        <p className="text-gray-400 mt-2">Welcome back, {user?.name}!</p>
      </div>

      {/* Notifications Section */}
      {notifications.length > 0 && (
        <div className="bg-gray-900 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Notifications</h2>
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="bg-gray-800 p-4 rounded-lg border-l-4 border-indigo-500 cursor-pointer hover:bg-gray-700 transition-colors"
                onClick={() => markNotificationAsRead(notification.id)}
              >
                <p className="text-white">{notification.message}</p>
                <p className="text-gray-400 text-sm mt-1">
                  {new Date(notification.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending Enrollments Section */}
      <div className="bg-gray-900 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Pending Enrollments</h2>
        
        {enrollments.length === 0 ? (
          <div className="text-center py-12">
            <ClockIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-400 text-lg">No pending enrollments</p>
          </div>
        ) : (
          <div className="space-y-4">
            {enrollments.map((enrollment) => (
              <div
                key={enrollment.id}
                className="bg-gray-800 p-6 rounded-lg border border-gray-700"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {enrollment.student.fullName}
                    </h3>
                    <p className="text-gray-400 mb-2">{enrollment.student.email}</p>
                    <p className="text-indigo-400 font-medium">
                      Course: {enrollment.course.title}
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      Requested: {new Date(enrollment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex space-x-3 ml-6">
                    <button
                      onClick={() => handleApprove(enrollment.id)}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors"
                    >
                      <CheckCircleIcon className="h-5 w-5 mr-2" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleDeny(enrollment.id)}
                      className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors"
                    >
                      <XCircleIcon className="h-5 w-5 mr-2" />
                      Deny
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;
