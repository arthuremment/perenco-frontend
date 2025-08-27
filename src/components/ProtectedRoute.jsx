import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { token, user } = useAuthStore();
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && user?.role !== requiredRole) {
    // Rediriger vers le dashboard approprié selon le rôle
    return <Navigate to={user?.role === 'admin' ? '/admin-dashboard' : '/ship-dashboard'} />;
  }
  
  return children;
};

export default ProtectedRoute;