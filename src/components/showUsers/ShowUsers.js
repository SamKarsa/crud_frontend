import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { showAlert } from '../../funcitions';
import styles from './ShowUsers.module.css';

const ShowUsers = () => {
    const url = 'http://localhost:8080/api/users';
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        getUsers();
    }, []);

    useEffect(() => {
        setFilteredUsers(
            users.filter(user => 
                user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, users]);

    const getUsers = async () => {
        try {
            const response = await axios.get(url);
            setUsers(response.data);
            setFilteredUsers(response.data);
        } catch (error) {
            showAlert('Error al cargar los usuarios', 'error');
        } finally {
            setLoading(false);
        }
    };



    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
                <div className="spinner-border spinner-border-lg text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid px-4 py-4">
            <div className="card shadow border-0 rounded-4">
                {/* Header mejorado con estadísticas */}
                <div className={`${styles.colorB} card-header bg-gradient text-white rounded-top-4 p-4`} >
                    <div className="row align-items-center">
                        <div className="col">
                            <h3 className="mb-1 d-flex align-items-center">
                                <i className="bi bi-people-fill me-2"></i>
                                Usuarios
                            </h3>
                            <p className="mb-0 small text-white-50">Gestión completa de usuarios registrados</p>
                        </div>
                    </div>
                </div>
                
                {/* Barra de filtrado y búsqueda */}
                <div className="card-body bg-light bg-opacity-25 border-bottom">
                    <div className="row g-3 align-items-center">
                        <div className="col-md-5">
                            <div className="input-group">
                                <span className="input-group-text bg-white border-end-0">
                                    <i className="bi bi-search text-muted"></i>
                                </span>
                                <input 
                                    type="text" 
                                    className="form-control border-start-0" 
                                    placeholder="Buscar usuarios..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-md-7 text-md-end">
                            <button className={`${styles.colorB} btn btn-primary fw-semibold px-4 py-2 rounded-pill shadow-sm`}>
                                <i className="bi bi-plus-lg me-2"></i>
                                Agregar Usuario
                            </button>
                        </div>
                    </div>
                </div>

                {/* Contenido de la tabla */}
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="ps-4">
                                        <div className="d-flex align-items-center">
                                            <span>#ID</span>
                                            <i className="bi bi-arrow-down-short ms-1 text-muted"></i>
                                        </div>
                                    </th>
                                    <th>Nombre completo</th>
                                    <th>Contacto</th>
                                    <th>Edad</th>
                                    <th>Rol</th>
                                    <th className="text-end pe-4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map(user => (
                                        <tr key={user.Id}>
                                            <td className="ps-4 fw-semibold text-primary">#{user.Id}</td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div>
                                                        <h6 className="mb-0">{user.firstName} {user.lastName}</h6>
                                                        <small className="text-muted">ID: {user.Id}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <div className="mb-1">
                                                        <i className="bi bi-envelope me-2 text-muted"></i>
                                                        <a href={`mailto:${user.email}`} className="text-decoration-none">{user.email}</a>
                                                    </div>
                                                    <div>
                                                        <i className="bi bi-telephone me-2 text-muted"></i>
                                                        <a href={`tel:${user.phone}`} className="text-decoration-none">{user.phone}</a>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="badge bg-light text-dark border px-3 py-2">
                                                    {user.age} años
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge rounded-pill px-3 py-2 ${
                                                    user.position?.positionName === 'Admin' 
                                                        ? 'bg-primary text-white' 
                                                        : user.position?.positionName 
                                                            ? 'bg-secondary bg-opacity-25 text-dark' 
                                                            : 'bg-warning bg-opacity-25 text-warning'
                                                }`}>
                                                    {user.position?.positionName || 'Sin Rol'}
                                                </span>
                                            </td>
                                            <td className="text-end pe-4">
                                                <div className="btn-group" role="group">
                                                    <button className="btn btn-outline-primary btn-sm rounded-start" title="Editar usuario">
                                                        <i className="bi bi-pencil-square"></i>
                                                    </button>
                                                    <button 
                                                        className="btn btn-outline-danger btn-sm rounded-end" 
                                                        title="Eliminar usuario"
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-5">
                                            <div className="p-4">
                                                <div className="d-flex flex-column align-items-center">
                                                    <div className="display-1 text-muted mb-3">
                                                        <i className="bi bi-person-x"></i>
                                                    </div>
                                                    <h4 className="text-muted">No se encontraron usuarios</h4>
                                                    <p className="text-muted mb-4">
                                                        {searchTerm 
                                                            ? 'No hay resultados para tu búsqueda, intenta con otros términos' 
                                                            : 'Agrega nuevos usuarios para comenzar a trabajar con el sistema'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                {/* Footer mejorado con paginación */}
                <div className="card-footer bg-white rounded-bottom-4 p-3">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <span className="text-muted">
                                Mostrando <strong>{filteredUsers.length}</strong> de <strong>{users.length}</strong> usuarios
                            </span>
                        </div>
                        <div className="col-md-6">
                            <nav aria-label="Page navigation" className="float-md-end">
                                <ul className="pagination pagination-sm mb-0">
                                    <li className="page-item disabled">
                                        <span className="page-link">Anterior</span>
                                    </li>
                                    <li className="page-item active">
                                        <span className="page-link">1</span>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="#">2</a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="#">3</a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="#">Siguiente</a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShowUsers;