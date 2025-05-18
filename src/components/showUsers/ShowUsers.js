import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { showAlert,deleteUser,confirmAlert } from '../../functions';
import styles from './ShowUsers.module.css';
import UserFormModal from '../UserFormModal/UserFormModal';

const ShowUsers = () => {
    const url = 'http://localhost:8080/api/users';
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [selectedUser, setSelectedUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages,setTotalPages] = useState(1);

    const hasFetched = useRef(false);

    useEffect(() => {
        if (hasFetched.current) return;

        getUsers(currentPage);
        hasFetched.current = true;
    }, [searchTerm]);

    useEffect(() => {
        setFilteredUsers(
            users.filter(user =>
                user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, users]);

        const getUsers = async (page = 1, limit = 10) => {
            try {
                setLoading(true);
                const response = await axios.get(`${url}?page=${page}&limit=${limit}`);
                
                // Ajusta según la estructura real de tu API
                setUsers(response.data.users || response.data.rows || []);
                setFilteredUsers(response.data.users || response.data.rows || []);
                setCurrentPage(response.data.currentPage || page);
                setTotalPages(response.data.totalPages || 1);

            } catch (error) {
                console.error('Error fetching users:', error);
                showAlert('Error fetching the users', 'error');
            } finally {
                setLoading(false);
            }
        };

    const handleDelete = async (id)=> {
        const confirmed = await confirmAlert('Are you sure you want to delete this user?');
        if (!confirmed) return;
        try{
            await deleteUser(id);
            showAlert('User deleted successfully', 'success');
            await getUsers(currentPage); // o conservar la misma página

        
        }catch (e){
            showAlert('Error deleting user', 'error');
        }
    };
    
        const handleCreate = () => {
            setModalMode('create');
            setSelectedUser(null);
            setShowModal(true);
        }
    
        const handleEdit = (user) => {
            setModalMode('edit');
            setSelectedUser(user);
            setShowModal(true);
        }
    
        const handleClose = () => {
            setShowModal(false);
        }

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
        <div className="container-fluid px-3 py-3">
            <div className="card  border-0 rounded-4">
                {/* Header mejorado con estadísticas */}
                <div className={`${styles.colorP} card-header bg-gradient text-white rounded-top-4 p-4`} >
                    <div className="row align-items-center">
                        <div className="col">
                            <h3 className={`${styles.colorT} mb-1 d-flex align-items-center`}>
                                <i className={`bi bi-people-fill me-2`}></i>
                                Users
                            </h3>
                            <p className={`${styles.colorT} mb-0 small `}>Complete gestion of registered users</p>
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
                                    placeholder="Search Users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-md-7 text-md-end">
                            <button 
                                onClick={handleCreate}
                                className={`${styles.colorB}  fw-semibold px-4 py-2 rounded-pill `}>
                                <i className="bi bi-plus-lg me-2"></i>
                                Add User
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
                                    <th>Full Name</th>
                                    <th>Contact</th>
                                    <th>Age</th>
                                    <th>Position</th>
                                    <th className="text-end pe-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map(user => (
                                        <tr key={user.id}>
                                            <td className="ps-4 fw-semibold text-dark">{user.id}</td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div>
                                                        <h6 className="mb-0">{user.firstName} {user.lastName}</h6>

                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <div className="mb-1">
                                                        <i className="bi bi-envelope me-2 text-muted"></i>
                                                        <a href={`mailto:${user.email}`} className={`${styles.colorT} text-decoration-none`}>{user.email}</a>
                                                    </div>
                                                    <div>
                                                        <i className="bi bi-telephone me-2 text-muted"></i>
                                                        <a href={`tel:${user.phone}`} className={`${styles.colorT} text-decoration-none`}>{user.phone}</a>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="badge bg-light text-dark border px-3 py-2">
                                                    {user.age} Years
                                                </span>
                                            </td>
                                            <td>
                                            <span className={`badge rounded-pill px-3 py-2 ${
                                                !user.position || !user.position.status 
                                                ? styles.inactivePosition // Rojo suave si está inactivo
                                                : user.position.positionName === 'Admin' 
                                                    ? styles.adminPosition 
                                                    : user.position.positionName === 'Supervisor' 
                                                    ? styles.supervisorPosition 
                                                    : styles.defaultPosition
                                            }`}>
                                                {user.position?.positionName || 'No Position'}
                                                {user.position?.status === false && (
                                                <i className="bi bi-x-circle ms-2"></i>
                                                )}
                                            </span>
                                            </td>
                                            <td className="text-end pe-4">
                                                <div className="btn-group" role="group">
                                                    <button 
                                                        onClick={() => handleEdit(user)}
                                                        className="btn btn-outline-primary btn-sm rounded-start" 
                                                        title="Editar usuario">
                                                        <i className="bi bi-pencil-square"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-outline-danger btn-sm rounded-end"
                                                        title="Eliminar usuario"
                                                        onClick={() => handleDelete(user.id)}
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
                                                    <h4 className="text-muted">No users found</h4>
                                                    <p className="text-muted mb-4">
                                                        {searchTerm
                                                            ? 'There are no results for your search, try other terms'
                                                            : 'Add new users to start working with the system'}
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
                    Showing <strong>{filteredUsers.length}</strong> users on page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                </span>
            </div>
            <div className="col-md-6">
                <nav aria-label="..." className="float-md-end">
                    <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
                            <button
                                className="page-link text-dark border-secondary"
                                onClick={() => currentPage > 1 && getUsers(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                        </li>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                <button
                                    className={`page-link ${currentPage === page ? 'bg-light text-dark border-dark' : 'text-dark border-dark'}`}
                                    onClick={() => getUsers(page)}
                                >
                                    {page}
                                </button>
                            </li>
                        ))}

                        <li className={`page-item ${currentPage === totalPages && 'disabled'}`}>
                            <button
                                className="page-link text-dark border-secondary"
                                onClick={() => currentPage < totalPages && getUsers(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </div>
            </div>
            {showModal && (
                <UserFormModal
                    show={showModal}
                    userData={selectedUser}
                    handleClose={handleClose}
                    onSuccess={getUsers}
                    mode={modalMode}
                />
            )}
        </div>
    );
};

export default ShowUsers;