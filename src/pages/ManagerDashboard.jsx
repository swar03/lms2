import { useCallback, useEffect, useState } from 'react';
import { approveEnrollment, denyEnrollment, getManagerDashboard } from '../services/api';
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
    let mounted = true;
    (async () => {
      try {
        const res = await getManagerDashboard();
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

  const handleApprove = useCallback(async (id) => {
    try {
      setActionLoadingId(id);
      await approveEnrollment(id);
      await load();
    } catch (e) {
      setError(e);
    } finally {
      setActionLoadingId(null);
    }
  }, [load]);

  const handleDeny = useCallback(async (id) => {
    try {
      setActionLoadingId(id);
      await denyEnrollment(id);
      await load();
    } catch (e) {
      setError(e);
    } finally {
      setActionLoadingId(null);
    }
  }, [load]);

  if (loading) return <div style={{ padding: 24 }}>Loading manager dashboard...</div>;
  if (error) return <div style={{ padding: 24, color: 'red' }}>{error?.message || 'Failed to load manager dashboard'}</div>;

  const enrollments = data?.pendingEnrollments || [];

  return (
    <div style={{ padding: 24 }}>
      <h1>Manager Dashboard</h1>
      <div>Welcome, {user?.name || user?.email}</div>
      <section style={{ marginTop: 16 }}>
        <h2>Pending Enrollments</h2>
        {enrollments.length === 0 ? (
          <div>No pending enrollments</div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {enrollments.map((enr) => (
              <li key={enr.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                <div style={{ flex: 1 }}>
                  <div><strong>Student:</strong> {enr.studentName}</div>
                  <div><strong>Course:</strong> {enr.courseTitle}</div>
                </div>
                <button onClick={() => handleApprove(enr.id)} disabled={actionLoadingId === enr.id}>
                  {actionLoadingId === enr.id ? 'Approving...' : 'Approve'}
                </button>
                <button onClick={() => handleDeny(enr.id)} disabled={actionLoadingId === enr.id}>
                  {actionLoadingId === enr.id ? 'Denying...' : 'Deny'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section style={{ marginTop: 16 }}>
        <h2>Overview</h2>
        <pre style={{ background: '#f5f5f5', padding: 12, overflow: 'auto' }}>{JSON.stringify(data, null, 2)}</pre>
      </section>
    </div>
  );
}

