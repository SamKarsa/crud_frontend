import { Routes, Route, BrowserRouter, Navigate, useLocation } from 'react-router-dom';
import "bootstrap-icons/font/bootstrap-icons.css";
import Showusers from './components/showUsers/ShowUsers';
import Header from './components/header/Header';
import ShowPositions from './components/showPositions/ShowPositions';
import Login from './components/login/Login';
import Unauthorized from './components/unauthorized/Unauthorized';
import ProtectedRoute from './components/routes/ProtectedRoute';
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthService from './services/AuthService';
import { useEffect } from 'react';

// Componente de Layout que renderiza el Header condicionalmente
const Layout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  
  return (
    <>
      {/* Renderiza el Header solo si NO estamos en la página de login */}
      {!isLoginPage && <Header />}
      <Routes>
        {/* Ruta pública de login */}
        <Route path="/login" element={<Login />} />
        
        {/* Página de acceso no autorizado */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        {/* Rutas protegidas para cualquier usuario autenticado */}
        <Route element={<ProtectedRoute />}>
          {/* Ruta de usuarios - acceso para todos los usuarios autenticados */}
          <Route path="/" element={<Showusers />} />
        </Route>
        
        {/* Rutas protegidas para admin y supervisor */}
        <Route element={<ProtectedRoute requiredRoles={['admin', 'supervisor']} />}>
          <Route path="/positions" element={<ShowPositions />} />
        </Route>
        
        {/* Redirección para rutas no encontradas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

function App() {
  useEffect(() => {
    // Configuración global para JWT
    const token = AuthService.getToken();
    if (token) {
      // Si hay un token en localStorage, verificar su validez
      const checkTokenValidity = async () => {
        try {
          // Puedes hacer una petición a tu endpoint de validación de token
          await fetch('http://localhost:8080/api/auth/validate', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          // Si no hay error, el token es válido
        } catch (error) {
          // Si hay error, el token es inválido o expiró
          console.error('Token inválido:', error);
          AuthService.logout();
          window.location.href = '/login';
        }
      };
      
      checkTokenValidity();
    }
  }, []);

  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;