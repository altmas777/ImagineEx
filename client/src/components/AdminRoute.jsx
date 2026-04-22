import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" replace />; // redirect to home if not admin
  }

  return children;
};
