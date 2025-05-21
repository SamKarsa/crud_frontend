import swal from 'sweetalert2'; //SweetAlert2 for beautiful alerts
import withReactContent from 'sweetalert2-react-content'; //React integration
import axios from 'axios'; //HTTP client

import AuthService from './services/AuthService'; // Authentication service

// Configure axios to automatically include the JWT token in requests
axios.interceptors.request.use(
  (config) => {
    const token = AuthService.getToken(); // Get token from storage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Add to headers
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // Pass through errors
  }
);
/*
// Interceptor para manejar errores 401 (token inválido o expirado)
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token inválido o expirado
      AuthService.logout();
      window.location.href = '/login';
      showAlert('Sesión expirada. Por favor inicia sesión nuevamente.', 'warning');
    }
    return Promise.reject(error);
  }
);*/

export function showAlert(message, icon, focus = '') {
  onfocus(focus);
  const MySwal = withReactContent(swal); // React-enhanced SweetAlert
  
  return MySwal.fire({
    title: message,
    icon: icon,
    confirmButtonText: 'Aceptar',
    allowOutsideClick: false, // Prevent closing by clicking backdrop
    allowEscapeKey: false // Prevent closing with ESC key
  });
}

export async function confirmAlert(message) {
  const result = await swal.fire({
    title: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'Cancel',
    allowOutsideClick: false // Prevent accidental dismissals
  });
  return result.isConfirmed; // Return user's choice
}

function onfocus(focus) {
  if (focus !== '') {
    document.getElementById(focus).focus(); // Optional chaining for safety
  }
}

// API endpoints
const delete_url = 'http://localhost:8080/api/users';

//Deletes a user by ID
export async function deleteUser(id) {
  try {
    const response = await axios.delete(`${delete_url}/${id}`);
    return response.data;
  } catch (e) {
    throw new Error('Error deleting user:' + e.message); // More descriptive error
  }
}

const deletePosition_url = 'http://localhost:8080/api/positions';

//Deletes a position by ID
export async function deletePosition(id) {
  try {
    const response = await axios.delete(`${deletePosition_url}/${id}`);
    return response.data;
  } catch (e) {
    throw new Error('Error delete position: ' + e.message);
  }
}