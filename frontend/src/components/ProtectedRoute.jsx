import { Navigate } from 'react-router-dom';
import { getCurrentUserRole } from '../utils/auth';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const role = getCurrentUserRole();

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
