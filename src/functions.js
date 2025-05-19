import swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';

import AuthService from './services/AuthService';

// Configurar axios para incluir automáticamente el token en las solicitudes
axios.interceptors.request.use(
  (config) => {
    const token = AuthService.getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
);

export function showAlert(message,icon,focus=''){
    onfocus(focus);
    const Myswal = withReactContent(swal);
    Myswal.fire({
        title:message,
        icon:icon,
    })
}

export async function confirmAlert(message){
    const result = await swal.fire({
        title: message,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
    })
    return result.isConfirmed;
}

function onfocus(focus){
    if(focus !== ''){
        document.getElementById(focus).focus();
    }
}


const delete_url='http://localhost:8080/api/users';

export async  function deleteUser(id){
    try {
        const response = await axios.delete(`${delete_url}/${id}`);
        return response.data;
    }catch (e) {
        throw new Error('Error deleting user:' + e.message)
    }
}

const deletePosition_url = 'http://localhost:8080/api/positions';

export async function deletePosition(id){
    try{
        const response = await axios.delete(`${deletePosition_url}/${id}`);
            return response.data;
    }catch (e) {
        throw new Error('Error delete position: ' + e.message);
    }
}
