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
    <div className="login-page">
      <div className="login-container">
        <div className="login-card-wrapper">
          <div className="login-card">
            <div className="login-header">
              <div className="login-logo">CRUD</div>
              <h1>Welcome</h1>
              <p>Join your cretentials to continue</p>
            </div>
            
            <form onSubmit={handleLogin} noValidate>
              <div className="form-floating mb-4">
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
                <label htmlFor="email"><i className="bi bi-envelope-fill me-2"></i>Email</label>
              </div>
              
              <div className="form-floating mb-4">
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
                <label htmlFor="password"><i className="bi bi-lock-fill me-2"></i>Password</label>
              </div>
              
              <div className="d-grid">
                <button 
                  type="submit" 
                  className="btn btn-login"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> loading...
                    </>
                  ) : 'Log In'}
                </button>
              </div>
            </form>
            
            <div className="login-divider">
              <span>CRUD Management System</span>
            </div>
            
            <div className="login-footer">
              <p>User and position management system</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;