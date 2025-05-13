import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Header.module.css'

const Header = () => {
  return (
    <header className='pb-4'>
      <nav className={`${styles.nav} navbar navbar-expand-lg navbar-dark shadow p-4`}>
        <div className="container-fluid">

            <Link className= "navbar-brand d-flex align-items-center" to="/">
                <span className={`${styles.underdog_regular} fs-3 fw-bold`}>CRUD</span>
            </Link>

            <button 
                className="navbar-toggler" 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target="#navbarContent"
                aria-controls="navbarContent">
                <span className="navbar-toggler-icon"></span>
            </button>

         
            <div className="collapse navbar-collapse" id="navbarContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <Link className="nav-link active fs-5" to="/">
                            <i className="bi bi-people-fill me-2"></i>Users
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link fs-5" to="/positions">
                            <i className="bi bi-briefcase-fill me-2"></i>Positions
                        </Link>
                    </li>
                </ul>

                

                <div className="d-flex align-items-center">
                    <div className="dropdown">
                        <button 
                        className="btn btn-light dropdown-toggle d-flex align-items-center" 
                        type="button"
                        data-bs-toggle="dropdown">
                            <i className="bi bi-person-circle me-2 fs-4"></i>
                            <span>Usuario</span>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li><Link className="dropdown-item" to="/profile">Perfil</Link></li>
                            <li><hr className="dropdown-divider"/></li>
                            <li><button className="dropdown-item text-danger">Cerrar sesión</button></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
      </nav>
    </header>
  )
}

export default Header