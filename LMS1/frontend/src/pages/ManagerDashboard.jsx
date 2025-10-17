import { useCallback, useEffect, useState } from 'react';
import { getManagerDashboard } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ManagerDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getManagerDashboard();
      setData(res);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);



  const handleApproveProfile = async (userId) => {
    try {
      setActionLoadingId(`profile-${userId}`);
      const response = await fetch(`http://localhost:3000/api/profiles/${userId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        await load(); // Refresh data
      } else {
        throw new Error('Failed to approve profile');
      }
    } catch (e) {
      setError(e);
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">Loading manager dashboard...</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-red-400">{error?.message || 'Failed to load manager dashboard'}</div>
      </div>
    </div>
  );

  const managedCourses = data?.managedCourses || [];
  const stats = data?.stats || {};
  const notifications = data?.notifications || [];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Manager Dashboard</h1>
          <p className="text-gray-400">Welcome, {user?.fullName || user?.email}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-2xl font-bold text-blue-400">{stats.totalCourses || 0}</div>
            <div className="text-gray-400">Managed Courses</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-2xl font-bold text-green-400">{stats.totalSubmissions || 0}</div>
            <div className="text-gray-400">Total Submissions</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-2xl font-bold text-orange-400">{managedCourses.length || 0}</div>
            <div className="text-gray-400">Active Courses</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-2xl font-bold text-yellow-400">{notifications.length || 0}</div>
            <div className="text-gray-400">Notifications</div>
          </div>
        </div>

        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="mb-8 bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              🔔 Notifications
              <span className="ml-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                {notifications.length}
              </span>
            </h2>
            <div className="space-y-3">
              {notifications.slice(0, 5).map((notification) => (
                <div key={notification.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="text-sm text-gray-300">{notification.message}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pending Profile Approvals */}
        <div className="mb-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Pending Profile Approvals
            {(data?.pendingProfiles?.length || 0) > 0 && (
              <span className="ml-2 bg-orange-600 text-white text-xs px-2 py-1 rounded-full">
                {data.pendingProfiles.length}
              </span>
            )}
          </h2>
          
          {(!data?.pendingProfiles || data.pendingProfiles.length === 0) ? (
            <div className="text-gray-400 text-center py-8">No pending profile approvals</div>
          ) : (
            <div className="grid gap-4">
              {data.pendingProfiles.map((profile) => (
                <div key={profile.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{profile.fullName}</h3>
                      <p className="text-gray-400 text-sm">{profile.email}</p>
                      <p className="text-gray-500 text-xs">
                        Profile completed: {new Date(profile.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproveProfile(profile.id)}
                        disabled={actionLoadingId === `profile-${profile.id}`}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium disabled:opacity-50"
                      >
                        {actionLoadingId === `profile-${profile.id}` ? 'Approving...' : 'Approve Profile'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>



        {/* Managed Courses */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Your Managed Courses</h2>
          {managedCourses.length === 0 ? (
            <div className="text-gray-400 text-center py-8">No courses assigned</div>
          ) : (
            <div className="grid gap-4">
              {managedCourses.map((course) => (
                <div key={course.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{course.title}</h3>
                      <p className="text-gray-400 text-sm">{course.description}</p>
                      <div className="flex gap-4 mt-2 text-sm">
                        <span className="text-blue-400">
                          📚 {course._count?.modules || 0} modules
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}