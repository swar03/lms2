import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import studentService from '../services/student.service';

export default function TestDashboard() {
  const [user, setUser] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        // Check if logged in
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        console.log('Token:', token ? 'Present' : 'Missing');
        console.log('Stored User:', storedUser);

        if (!token) {
          navigate('/login');
          return;
        }

        // Get current user
        const userResponse = await authService.getCurrentUser();
        console.log('User Response:', userResponse);
        setUser(userResponse.user);

        // Get dashboard
        const dashboardResponse = await studentService.getDashboard();
        console.log('Dashboard Response:', dashboardResponse);
        setDashboard(dashboardResponse.data);

      } catch (error) {
        console.error('Error loading dashboard:', error);
        console.error('Error response:', error.response?.data);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-4">Loading...</div>
          <div className="text-gray-400">Fetching your dashboard data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test Dashboard</h1>

        {/* User Info */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">User Information</h2>
          {user ? (
            <pre className="bg-gray-900 p-4 rounded overflow-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          ) : (
            <p className="text-red-400">No user data</p>
          )}
        </div>

        {/* Dashboard Data */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Dashboard Data</h2>
          {dashboard ? (
            <pre className="bg-gray-900 p-4 rounded overflow-auto max-h-96">
              {JSON.stringify(dashboard, null, 2)}
            </pre>
          ) : (
            <p className="text-red-400">No dashboard data</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded"
          >
            Go to Real Dashboard
          </button>
          <button
            onClick={() => {
              authService.logout();
              navigate('/login');
            }}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}