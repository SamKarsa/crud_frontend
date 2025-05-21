//IMPORTS 
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom'; // Used for routing and redirects
import AuthService from '../../services/AuthService'; // Custom authentication utility

const ProtectedRoute = ({ requiredRoles = [] }) => {
  //CHECK AUTHENTICATION STATUS
  const isAuthenticated = AuthService.isAuthenticated();
  
  // USER NOT LOGGED IN 
  if (!isAuthenticated) {
    // Redirect unauthenticated users to the login page
    return <Navigate to="/login" replace />;
  }
  
  // ROLE-BASED ACCESS CONTROL
  if (requiredRoles.length > 0) {
    // Check if user has at least one of the required roles
    const hasRequiredRole = AuthService.hasRole(requiredRoles);
    if (!hasRequiredRole) {
      // User is authenticated but not authorized => redirect to unauthorized page
      return <Navigate to="/unauthorized" replace />;
    }
  }
  
  //ACCESS GRANTED
  // Renders child routes/components if authentication and roles match
  return <Outlet />;
};

export default ProtectedRoute;