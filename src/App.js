import { Routes, Route, BrowserRouter, Navigate, useLocation } from 'react-router-dom';
import "bootstrap-icons/font/bootstrap-icons.css"; //Boostrap icons
import Showusers from './components/showUsers/ShowUsers';
import Header from './components/header/Header';
import ShowPositions from './components/showPositions/ShowPositions';
import Login from './components/login/Login';
import ProtectedRoute from './components/routes/ProtectedRoute';
import 'bootstrap/dist/css/bootstrap.min.css'; //Bootstrap CSS
import AuthService from './services/AuthService';
import { useEffect } from 'react';

// Layout component that conditionally renders the Header
const Layout = () => {
  const location = useLocation(); //Hook to access current route location
  const isLoginPage = location.pathname === '/login'; // Check if current route is login
  
  return (
    <>
      {/* Conditionally render Header - hidden on login page */}
      {!isLoginPage && <Header />}
      // Main application routes
      <Routes>
        {/* Public route - Login page  */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes - accessible to any authenticated user */}
        <Route element={<ProtectedRoute />}>
          {/* Users dashboard - default route */}
          <Route path="/" element={<Showusers />} />
        </Route>
        
        {/* Protected routes - only for admin and supervisor roles */}
        <Route element={<ProtectedRoute requiredRoles={['admin', 'supervisor']} />}>
          <Route path="/positions" element={<ShowPositions />} />
        </Route>
        
        {/* Catch-all route - redirects to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

//Main App component with token validation and routing setup
function App() {
  // Effect to validate token on initial load
  useEffect(() => {
    const token = AuthService.getToken();
    if (token) {
      // Async function to validate token with backend
      const checkTokenValidity = async () => {
        try {
          // Make validation request to backend
          await fetch('http://localhost:8080/api/auth/validate', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          // Token is valid if no error thrown
        } catch (error) {
          // Handle invalid/expired token
          console.error('Token inválido:', error);
          AuthService.logout(); // Clear auth data
          window.location.href = '/login'; // Force full page reload to reset state
        }
      };
      
      checkTokenValidity();
    }
  }, []); // Runs only once on component mount

  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;