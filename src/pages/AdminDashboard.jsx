import { useEffect, useState } from 'react';
import { getAdminDashboard } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div style={{ padding: 24 }}>Loading admin dashboard...</div>;
  if (error) return <div style={{ padding: 24, color: 'red' }}>{error?.message || 'Failed to load admin dashboard'}</div>;

  return (
    <div style={{ padding: 24 }}>
      <h1>Admin Dashboard</h1>
      <div>Welcome, {user?.name || user?.email}</div>
      <section style={{ marginTop: 16 }}>
        <h2>System Stats</h2>
        <pre style={{ background: '#f5f5f5', padding: 12, overflow: 'auto' }}>{JSON.stringify(data, null, 2)}</pre>
      </section>
    </div>
  );
}

