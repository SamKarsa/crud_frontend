
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthService from '../../services/AuthService';

const ProtectedRoute = ({ requiredRoles = [] }) => {
  const isAuthenticated = AuthService.isAuthenticated();
  
  // Verificar si el usuario está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Si se requieren roles específicos, verificar que el usuario tenga alguno de ellos
  if (requiredRoles.length > 0) {
    const hasRequiredRole = AuthService.hasRole(requiredRoles);
    if (!hasRequiredRole) {
      // El usuario no tiene el rol necesario, redirigir a una página de acceso denegado
      return <Navigate to="/unauthorized" replace />;
    }
  }
  
  // Si el usuario está autenticado y tiene los roles necesarios, mostrar la ruta protegida
  return <Outlet />;
};

export default ProtectedRoute;