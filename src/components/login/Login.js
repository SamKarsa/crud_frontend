import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { showAlert } from '../../functions';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirigir si ya está autenticado
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (loading) return; 
    
    setLoading(true);
    
    // Validación básica
    if (!email || !password) {
      showAlert('Please enter email and password', 'error');
      setLoading(false);
      return;
    }

    try {
      // Realizar petición de login
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email,
        password
      });

      // Procesar respuesta exitosa
      if (response.data.success) {
        // Verificar permisos antes de guardar datos
        const userPosition = response.data.data.position;
        
        // Verificar si la posición es un objeto o un string
        const positionName = typeof userPosition === 'object' 
          ? userPosition.positionName.toLowerCase() 
          : userPosition.toLowerCase();
        
        if (!['admin', 'supervisor'].includes(positionName)) {
          // Si no tiene permisos, mostrar alerta y NO guardar credenciales
          await showAlert('Permisos insuficientes. Se requiere posición de admin o supervisor.', 'warning');
          setLoading(false);
          return;
        }
        
        // Si tiene permisos, guardar token y datos de usuario
        localStorage.setItem('authToken', response.data.data.token);
        
        const userData = {
          id: response.data.data.id,
          firstName: response.data.data.firstName,
          lastName: response.data.data.lastName,
          email: response.data.data.email,
          position: userPosition
        };
        
        localStorage.setItem('userData', JSON.stringify(userData));
        
        
        // Navegar a la página principal
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error('Error durante el login:', error);
      
      // Manejo de errores específicos
      if (error.response) {
        await showAlert(error.response.data.message || 'Error al iniciar sesión', 'error');
      } else if (error.request) {
        await showAlert('No se pudo conectar con el servidor', 'error');
      } else {
        await showAlert('Error inesperado, por favor intenta de nuevo', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card login-card shadow">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h2 className="login-title">CRUD App</h2>
                  <p className="text-muted">Ingresa a tu cuenta</p>
                </div>
                
                <form onSubmit={handleLogin} noValidate>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-envelope-fill"></i>
                      </span>
                      <input 
                        type="email" 
                        className="form-control" 
                        id="email" 
                        placeholder="ejemplo@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="username"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="password" className="form-label">Contraseña</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-lock-fill"></i>
                      </span>
                      <input 
                        type="password" 
                        className="form-control" 
                        id="password" 
                        placeholder="Tu contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                      />
                    </div>
                  </div>
                  
                  <div className="d-grid gap-2">
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Cargando...
                        </>
                      ) : 'Iniciar sesión'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;