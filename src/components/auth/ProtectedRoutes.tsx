// ProtectedRoutes.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import React from 'react';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;