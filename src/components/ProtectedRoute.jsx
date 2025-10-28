import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ roles, children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div style={{ padding: 24 }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (Array.isArray(roles) && roles.length > 0 && !roles.includes(user?.role)) return <Navigate to="/notfound" replace />;

  if (children) return children;
  return <Outlet />;
}

