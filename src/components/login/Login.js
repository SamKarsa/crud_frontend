//REACT IMPORTS 
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; //For programmatic navigation
import axios from 'axios'; // HTTP client for making API requests
import { showAlert } from '../../functions'; // Custom alert utility
import './Login.css'; // Custom styles for this component

//LOGIN COMPONENT
const Login = () => {
  //LOCAL STATE
  const [email, setEmail] = useState(''); // Email input state
  const [password, setPassword] = useState(''); // Password input state
  const [loading, setLoading] = useState(false); // Loading state during login
  const navigate = useNavigate(); // React Router navigation

  // REDIRECT IF ALREADY AUTHENTICATED
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/'); // Redirect to home if token exists
    }
  }, [navigate]);

  //LOGIN SUBMISSION HANDLER
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (loading) return; // Prevent multiple submissions 
    
    setLoading(true);
    
    // BASIC FORM VALIDATION
    if (!email || !password) {
      showAlert('Please enter email and password', 'error');
      setLoading(false);
      return;
    }

    try {
      // MAKE LOGIN REQUEST
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email,
        password
      });

      // HANDLE SUCCESSFUL RESPONSE
      if (response.data.success) {

        const userPosition = response.data.data.position;
        
        // Normalize position to lowercase string
        const positionName = typeof userPosition === 'object' 
          ? userPosition.positionName.toLowerCase() 
          : userPosition.toLowerCase();
        
        //CHECK FOR REQUIRED PERMISSIONS
        if (!['admin', 'supervisor'].includes(positionName)) {
          await showAlert('Insufficient permissions.', 'warning');
          setLoading(false);
          return;
        }
        
        //STORE TOKEN AND USER DATA IN LOCALSTORAGE
        localStorage.setItem('authToken', response.data.data.token);
        
        const userData = {
          id: response.data.data.id,
          firstName: response.data.data.firstName,
          lastName: response.data.data.lastName,
          email: response.data.data.email,
          position: userPosition
        };
        
        localStorage.setItem('userData', JSON.stringify(userData));
        
        
        // REDIRECT TO MAIN DASHBOARD
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error('Error durante el login:', error);
      
      // HANDLE DIFFERENT ERROR TYPES
      if (error.response) {
        await showAlert(error.response.data.message || 'Error al iniciar sesión', 'error');
      } else if (error.request) {
        await showAlert('No se pudo conectar con el servidor', 'error');
      } else {
        await showAlert('Error inesperado, por favor intenta de nuevo', 'error');
      }
    } finally {
      setLoading(false); // Always reset loading state
    }
  };

  //JSX RETURN
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
                      <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span> loading...
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