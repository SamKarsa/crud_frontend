// Archivo: src/services/AuthService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Configurar interceptor para agregar token a todas las peticiones
const setupAxiosInterceptors = () => {
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Interceptor para manejar errores de respuesta (como token expirado)
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

// Función para iniciar sesión
const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    if (response.data.success) {
      localStorage.setItem('authToken', response.data.data.token);
      localStorage.setItem('userData', JSON.stringify({
        id: response.data.data.id,
        firstName: response.data.data.firstName,
        lastName: response.data.data.lastName,
        email: response.data.data.email,
        position: response.data.data.position
      }));
      setupAxiosInterceptors();
      return response.data;
    }
    return null;
  } catch (error) {
    throw error;
  }
};

// Función para cerrar sesión
const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
};

// Función para verificar si el usuario está autenticado
const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};

// Función para obtener el token
const getToken = () => {
  return localStorage.getItem('authToken');
};

// Función para obtener información del usuario autenticado
const getCurrentUser = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

// Función corregida para verificar si el usuario tiene un rol específico
const hasRole = (requiredRoles) => {
  const user = getCurrentUser();
  if (!user || !user.position) return false;
  
  // Verificar estructura correcta del objeto position
  if (typeof user.position === 'object' && user.position.positionName) {
    const userRole = user.position.positionName.toLowerCase();
    return requiredRoles.map(role => role.toLowerCase()).includes(userRole);
  } else if (typeof user.position === 'string') {
    // Si position es un string (como parece estar guardado en el login)
    const userRole = user.position.toLowerCase();
    return requiredRoles.map(role => role.toLowerCase()).includes(userRole);
  }
  
  return false;
};

// Inicializar interceptores cuando se importe este servicio
setupAxiosInterceptors();

const AuthService = {
  login,
  logout,
  isAuthenticated,
  getToken,
  getCurrentUser,
  hasRole
};

export default AuthService;