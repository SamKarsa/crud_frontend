import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Header.module.css'

const Header = () => {
  return (
    <header className='pb-4'>
      <nav className={`${styles.nav} navbar navbar-expand-lg navbar-dark shadow`}>
        <div className="container-fluid">

          {/* Logo/Brand */}
          <Link className="navbar-brand d-flex align-items-center px-4" to="/">
            <span className={`${styles.logo}`}>C R U D</span>
          </Link>

          {/* Hamburger button for mobile */}
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarContent"
            aria-controls="navbarContent">
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navbar content */}
          <div className="collapse navbar-collapse justify-content-end px-4" id="navbarContent">
            <ul className="navbar-nav me-4 mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link fs-5" to="/">
                  <i className="bi bi-people-fill me-2"></i>Users
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link fs-5" to="/">
                  <i className="bi bi-briefcase-fill me-2"></i>Positions
                </Link>
              </li>
            </ul>

            {/* User profile dropdown */}
            <div className="dropdown">
              <button 
                className="btn btn-link p-1 rounded-circle" 
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false">
                <div className={`${styles.profileCircle} d-flex align-items-center justify-content-center bg-light rounded-circle`}>
                  <i className={`${styles.profileSymbol} bi bi-person-fill fs-3`}></i>
                </div>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li className="dropdown-item-text fw-bold text-center">Admin</li>
                <li><hr className="dropdown-divider"/></li>
                <li><button className="dropdown-item text-danger">Log Out</button></li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header