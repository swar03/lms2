import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import adminService from '../services/admin.service';

export default function AdminStudentManagement() {
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState('all'); // all, pending, approved
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [studentsRes, statsRes] = await Promise.all([
        adminService.getAllStudents(),
        adminService.getDashboard()
      ]);
      setStudents(studentsRes.students);
      setStats(statsRes.stats);
    } catch (error) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (studentId) => {
    try {
      await adminService.approveStudent(studentId);
      toast.success('Student approved successfully');
      loadData();
    } catch (error) {
      toast.error('Failed to approve student');
    }
  };

  const handleReject = async (studentId) => {
    const reason = prompt('Enter rejection reason (optional):');
    try {
      await adminService.rejectStudent(studentId, reason);
      toast.success('Student rejected');
      loadData();
    } catch (error) {
      toast.error('Failed to reject student');
    }
  };

  const filteredStudents = students.filter(s => {
    if (filter === 'pending') return s.status === 'PENDING';
    if (filter === 'approved') return s.status === 'APPROVED';
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Student Management</h1>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-gray-400 text-sm">Total Students</div>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
            </div>
            <div className="bg-yellow-900 bg-opacity-50 rounded-lg p-4">
              <div className="text-yellow-400 text-sm">Pending Approval</div>
              <div className="text-2xl font-bold">{stats.pendingStudents}</div>
            </div>
            <div className="bg-green-900 bg-opacity-50 rounded-lg p-4">
              <div className="text-green-400 text-sm">Approved</div>
              <div className="text-2xl font-bold">{stats.approvedStudents}</div>
            </div>
            <div className="bg-blue-900 bg-opacity-50 rounded-lg p-4">
              <div className="text-blue-400 text-sm">Total Courses</div>
              <div className="text-2xl font-bold">{stats.totalCourses}</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-indigo-600' : 'bg-gray-800'}`}
          >
            All ({students.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded ${filter === 'pending' ? 'bg-yellow-600' : 'bg-gray-800'}`}
          >
            Pending ({students.filter(s => s.status === 'PENDING').length})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded ${filter === 'approved' ? 'bg-green-600' : 'bg-gray-800'}`}
          >
            Approved ({students.filter(s => s.status === 'APPROVED').length})
          </button>
        </div>

        {/* Students Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Mobile</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Verified</th>
                <th className="px-4 py-3 text-left">Registered</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-t border-gray-700 hover:bg-gray-750">
                  <td className="px-4 py-3">
                    <div className="font-medium">{student.fullName || 'N/A'}</div>
                    {student.profile?.profileComplete && (
                      <div className="text-xs text-green-400">✓ Profile Complete</div>
                    )}
                  </td>
                  <td className="px-4 py-3">{student.email}</td>
                  <td className="px-4 py-3">{student.mobile || 'N/A'}</td>
                  <td className="px-4 py-3">
                    <select
                      value={student.status}
                      onChange={async (e) => {
                        const newStatus = e.target.value;
                        if (newStatus !== student.status) {
                          try {
                            await adminService.changeStudentStatus(student.id, newStatus);
                            toast.success(`Status changed to ${newStatus}`);
                            loadData();
                          } catch (error) {
                            toast.error('Failed to change status');
                          }
                        }
                      }}
                      className={`px-2 py-1 rounded text-xs font-medium cursor-pointer ${
                        student.status === 'APPROVED' ? 'bg-green-600 text-white' :
                        student.status === 'PENDING' ? 'bg-yellow-600 text-white' :
                        'bg-red-600 text-white'
                      }`}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="APPROVED">APPROVED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                    {student.approvals?.length > 0 && (
                      <div className="text-xs text-gray-400 mt-1">
                        {student.approvals[0].status} by {student.approvals[0].actor?.fullName || 'Admin'}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {student.emailVerified ? '✅' : '❌'}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(student.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(student.id)}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
                        disabled={student.status === 'APPROVED'}
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => handleReject(student.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                        disabled={student.status === 'REJECTED'}
                      >
                        ✗ Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredStudents.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No students found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}