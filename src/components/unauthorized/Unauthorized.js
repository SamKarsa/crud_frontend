import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          <div className="alert alert-danger">
            <h2>
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              Acceso No Autorizado
            </h2>
            <p className="lead mt-3">
              No tienes los permisos necesarios para acceder a esta página.
            </p>
            <p>
              Se requiere rol de admin o supervisor para acceder a ciertas funcionalidades.
            </p>
            <div className="mt-4">
              <Link to="/login" className="btn btn-primary">
                Volver al Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;