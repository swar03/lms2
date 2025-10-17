import { useEffect, useState } from 'react';
import { getAdminDashboard } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getAdminDashboard();
        if (mounted) setData(res);
      } catch (e) {
        if (mounted) setError(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">Loading admin dashboard...</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-red-400">{error?.message || 'Failed to load admin dashboard'}</div>
      </div>
    </div>
  );

  const stats = data?.stats || {};
  const recentUsers = data?.recentUsers || [];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'courses', label: 'Courses', icon: '📚' },
    { id: 'system', label: 'System', icon: '⚙️' }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">System Administration Panel</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="text-2xl font-bold text-blue-400">{stats.totalUsers || 0}</div>
                <div className="text-gray-400">Total Users</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="text-2xl font-bold text-green-400">{stats.totalCourses || 0}</div>
                <div className="text-gray-400">Total Courses</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="text-2xl font-bold text-yellow-400">{stats.totalSubmissions || 0}</div>
                <div className="text-gray-400">Total Submissions</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="text-2xl font-bold text-purple-400">
                  {((stats.totalUsers || 0) > 0 ? ((stats.totalCourses || 0) / (stats.totalUsers || 1) * 100) : 0).toFixed(1)}%
                </div>
                <div className="text-gray-400">Course Coverage</div>
              </div>
            </div>

            {/* Pending Approval Requests */}
            <div className="bg-gray-800 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Pending Approval Requests</h2>
              {recentUsers.filter(u => u.status === 'PENDING').length === 0 ? (
                <div className="text-gray-400 text-center py-8">No pending requests</div>
              ) : (
                <div className="grid gap-4">
                  {recentUsers.filter(u => u.status === 'PENDING').map((user) => (
                    <div key={user.id} className="bg-gray-700 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img
                          src={`https://ui-avatars.com/api/?name=${user.fullName || user.email}&background=4f46e5&color=fff&size=48`}
                          alt="Profile"
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <h3 className="font-semibold">{user.fullName || 'Unknown'}</h3>
                          <p className="text-sm text-gray-400">{user.email}</p>
                          <p className="text-xs text-gray-500">Registered: {new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={async () => {
                            try {
                              await fetch(`http://localhost:5000/api/v1/admin/approve-user/${user.id}`, {
                                method: 'POST',
                                headers: {
                                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
                                  'Content-Type': 'application/json'
                                }
                              });
                              window.location.reload();
                            } catch (error) {
                              console.error('Approval error:', error);
                            }
                          }}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium"
                        >
                          ✓ Accept
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              await fetch(`http://localhost:5000/api/v1/admin/reject-user/${user.id}`, {
                                method: 'POST',
                                headers: {
                                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
                                  'Content-Type': 'application/json'
                                }
                              });
                              window.location.reload();
                            } catch (error) {
                              console.error('Rejection error:', error);
                            }
                          }}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium"
                        >
                          ✕ Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Users */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
              {recentUsers.length === 0 ? (
                <div className="text-gray-400 text-center py-8">No recent users</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-400 border-b border-gray-700">
                        <th className="pb-3">Name</th>
                        <th className="pb-3">Email</th>
                        <th className="pb-3">Role</th>
                        <th className="pb-3">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map((user) => (
                        <tr key={user.id} className="border-b border-gray-700">
                          <td className="py-3">{user.fullName || '—'}</td>
                          <td className="py-3 text-gray-400">{user.email}</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              user.role === 'ADMIN' ? 'bg-red-600 text-red-100' :
                              user.role === 'MANAGER' ? 'bg-blue-600 text-blue-100' :
                              'bg-green-600 text-green-100'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3 text-gray-400 text-sm">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">User Management</h2>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium">
                Add New User
              </button>
            </div>
            
            <div className="grid gap-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold mb-2">User Statistics</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">Admins</div>
                    <div className="text-lg font-semibold text-red-400">
                      {recentUsers.filter(u => u.role === 'ADMIN').length}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Managers</div>
                    <div className="text-lg font-semibold text-blue-400">
                      {recentUsers.filter(u => u.role === 'MANAGER').length}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Students</div>
                    <div className="text-lg font-semibold text-green-400">
                      {recentUsers.filter(u => u.role === 'STUDENT').length}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Recent Activity</h3>
                <div className="text-sm text-gray-400">
                  Last user registration: {recentUsers[0] ? new Date(recentUsers[0].createdAt).toLocaleString() : 'None'}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Course Management</h2>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium">
                Create New Course
              </button>
            </div>
            
            <div className="grid gap-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Course Overview</h3>
                <div className="text-sm text-gray-400">
                  Total courses: {stats.totalCourses || 0}
                </div>
                <div className="text-sm text-gray-400">
                  Total users: {stats.totalUsers || 0}
                </div>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Quick Actions</h3>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm">
                    Bulk Import
                  </button>
                  <button className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-sm">
                    Export Data
                  </button>
                  <button className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm">
                    Analytics
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}



        {activeTab === 'system' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">System Settings</h2>
            
            <div className="grid gap-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold mb-2">System Status</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Database</span>
                    <span className="text-green-400">✅ Connected</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">API Server</span>
                    <span className="text-green-400">✅ Running</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Authentication</span>
                    <span className="text-green-400">✅ Active</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Maintenance</h3>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm">
                    Backup Database
                  </button>
                  <button className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-sm">
                    Clear Cache
                  </button>
                  <button className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm">
                    System Logs
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}