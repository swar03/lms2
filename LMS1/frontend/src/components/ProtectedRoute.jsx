import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ roles, children }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!token || !user.id) {
    return <Navigate to="/login" replace />;
  }
  
  // Check roles if specified
  if (Array.isArray(roles) && roles.length > 0) {
    const userRole = user.role || (user.roles && user.roles[0]);
    const hasRole = roles.includes(userRole);
    if (!hasRole) {
      return <Navigate to="/login" replace />;
    }
  }
  
  if (children) return children;
  return <Outlet />;
}