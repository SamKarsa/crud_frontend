import React from 'react'
import { Link, useNavigate } from 'react-router-dom' // Import routing components
import styles from './Header.module.css' // Import CSS module styles specific to Header component


const Header = () => {

  const navigate = useNavigate(); // Hook to programmatically navigate between routes

  // Retrieve user data from localStorage
  const userData = JSON.parse(localStorage.getItem('userData'));
  
  // Determine user's position name (with fallback options)
  const positionName = userData?.position?.positionName || userData?.positionName || 'User';

  // Clear session and redirect to login on logout
  const handleLogout = () => {
    // Remove the auth token from localStorage
    localStorage.removeItem('authToken'); // Remove auth token
    localStorage.removeItem('userData'); // Remove user info
    
    
    navigate('/login'); // Navigate to login page
  };
  return (
    <header>
      {/*Bootstrap navbar with custom styles applied*/}
      <nav className={`${styles.nav} navbar navbar-expand-lg navbar-dark shadow-sm`}>
        <div className="container-fluid">

          {/* App brand/logo that links to the home page */}
          <Link className="navbar-brand d-flex align-items-center px-4" to="/">
            <span className={`${styles.logo}`}>C R U D</span>
          </Link>

          {/* Responsive hamburger menu button (for mobile view) */}
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarContent"
            aria-controls="navbarContent">
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Collapsible content: navigation links and user menu */}
          <div className="collapse navbar-collapse justify-content-end px-4" id="navbarContent">
            {/*Navigation links section aligned to the right */}
            <ul className="navbar-nav me-4 mb-2 mb-lg-0">
              {/*Navigation link to Users page */}
              <li className="nav-item">
                <Link className="nav-link fs-5" to="/">
                  <i className="bi bi-people-fill me-2"></i>Users
                </Link>
              </li>
              {/*Navigation link to Positions page*/}
              <li className="nav-item">
                <Link className="nav-link fs-5" to="/positions">
                  <i className="bi bi-briefcase-fill me-2"></i>Positions
                </Link>
              </li>
            </ul>

            {/* User profile dropdown (right side of navbar) */}
            <div className="dropdown">
              {/*Profile icon button that toggles the dropdown menu*/}
              <button 
                className="btn btn-link p-1 rounded-circle" 
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false">
                {/*Circle background with user icon inside*/}
                <div className={`${styles.profileCircle} d-flex align-items-center justify-content-center bg-light rounded-circle`}>
                  <i className={`${styles.profileSymbol} bi bi-person-fill fs-3`}></i>
                </div>
              </button>
              {/*Dropdown menu shown when user clicks the profile icon*/}
              <ul className={`dropdown-menu dropdown-menu-end ${styles.dropdownMenu}`}>
                {/*Display the user's role/position name in bold*/}
                <li className="dropdown-item-text fw-bold text-center">{positionName}</li>
                <li><hr className="dropdown-divider"/></li>
                              <li>
                <button className={`dropdown-item ${styles.logoutButton}`}  onClick={handleLogout} > Logout
                </button>
              </li>
                </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

// Export the component for use in other parts of the app
export default Header