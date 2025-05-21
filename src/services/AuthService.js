// File: src/services/AuthService.js
import axios from 'axios';

//Base API URL - should ideally be configured through enviroment variables
const API_URL = 'http://localhost:8080/api';

// Configure axios interceptors to automatically handle authentication
const setupAxiosInterceptors = () => {
  // Request interceptor to attach token to all outgoing requests
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`; // Add Bearer token to headers
      }
      return config;
    },
    (error) => {
      return Promise.reject(error); // Pass through any request errors
    }
  );

  //  Response interceptor (currently commented out)
  axios.interceptors.response.use(
    (response) => {
      return response;
    }/*,
    (error) => {
      if (error.response && error.response.status === 401) {
        // Token inválido o expirado
        logout();
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }*/
  );
};

// Login function - authenticates user and stores token/user data
const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    if (response.data.success) {
      // Store authentication data in localStorage
      localStorage.setItem('authToken', response.data.data.token);
      localStorage.setItem('userData', JSON.stringify({
        id: response.data.data.id,
        firstName: response.data.data.firstName,
        lastName: response.data.data.lastName,
        email: response.data.data.email,
        position: response.data.data.position // Can be object or string
      }));
      // Initialize axios interceptors
      setupAxiosInterceptors();
      return response.data;
    }
    return null;
  } catch (error) {
    throw error; // Re-throw for error handling in components
  }
};

// Logout function - clears authentication data
const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
  //Note: Could add redirect to login page here if needed
};

// Checks if user is authenticated
const isAuthenticated = () => {
  return !!localStorage.getItem('authToken'); // Double negation converts to boolean
};

// Gets the stored authentication token
const getToken = () => {
  return localStorage.getItem('authToken');
};

// Gets current user data from localStorage
const getCurrentUser = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

// Checks if current user has required role(s)
const hasRole = (requiredRoles) => {
  const user = getCurrentUser();
  if (!user || !user.position) return false;
  
  if (typeof user.position === 'object' && user.position.positionName) {
    const userRole = user.position.positionName.toLowerCase();
    return requiredRoles.map(role => role.toLowerCase()).includes(userRole);
  } else if (typeof user.position === 'string') {
    const userRole = user.position.toLowerCase();
    return requiredRoles.map(role => role.toLowerCase()).includes(userRole);
  }
  
  return false;
};

// Initialize interceptors when this module is imported
setupAxiosInterceptors();

// Export service methods
const AuthService = {
  login,
  logout,
  isAuthenticated,
  getToken,
  getCurrentUser,
  hasRole
};

export default AuthService;