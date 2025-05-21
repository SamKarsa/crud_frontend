import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { showAlert,deleteUser,confirmAlert } from '../../functions';
import styles from './ShowUsers.module.css';
import UserFormModal from '../UserFormModal/UserFormModal';

//Main component for displaying and maniging users
const ShowUsers = () => {
    //API endpoint for users data
    const url = 'http://localhost:8080/api/users';
    //State declarations:
    const [users, setUsers] = useState([]); //Stores the complete list of users
    const [loading, setLoading] = useState(false); //Loading state indicator
    const [searchTerm, setSearchTerm] = useState(''); //Search term for filtering users
    const [filteredUsers, setFilteredUsers] = useState([]); //Stores filtered users based on search
    const [showModal, setShowModal] = useState(false); //Controls modal visibility
    const [modalMode, setModalMode] = useState('create'); //Determines if modal is in create/edit mode
    const [selectedUser, setSelectedUser] = useState(null); //Stores uer being edited
    const [currentPage, setCurrentPage] = useState(1); // Current pagination page
    const [totalPages,setTotalPages] = useState(1); // Total available pages

    // Ref to prevent duplicate initial fetches
    const hasFetched = useRef(false);

    // Effect for initial data fetch and page/search term changes
    useEffect(() => {
        if (hasFetched.current) return; // Prevent duplicate calls

        getUsers(currentPage);
        hasFetched.current = true;
    }, [searchTerm, currentPage]); // Dependencies: re-run when these change

    // Effect for filtering users based on search term
    useEffect(() => {
        setFilteredUsers(
            users.filter(user =>
                user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, users]); // Re-filter when search term or users list changes

        // Function to fetch users from API with pagination
        const getUsers = async (page = 1, limit = 10) => {
            try {
                setLoading(true); // Show loading state
                const response = await axios.get(`${url}?page=${page}&limit=${limit}`);
                
                // Handle different possible API response structures
                setUsers(response.data.users || response.data.rows || []);
                setFilteredUsers(response.data.users || response.data.rows || []);
                setCurrentPage(response.data.currentPage || page);
                setTotalPages(response.data.totalPages || 1);

            } catch (error) {
                console.error('Error fetching users:', error);
                showAlert('Error fetching the users', 'error');
            } finally {
                setLoading(false); // Hide loading state regardless of outcome
            }
        };

    // Function to handle user deletion with confirmation
    const handleDelete = async (id)=> {
        const confirmed = await confirmAlert('Are you sure you want to delete this user?');
        if (!confirmed) return; // Abort if not confirmed
        try{
            await deleteUser(id);
            showAlert('User deleted successfully', 'success');
            await getUsers(currentPage); // Refresh the user list
        } catch (e) {
            console.error('Error deleting user:', e);
            showAlert('Error deleting user', 'error');
        }
    };
    
        // Functions for modal management:
        const handleCreate = () => {
            setModalMode('create'); // Set modal to create mode
            setSelectedUser(null); // Clear any selected user
            setShowModal(true); // Show the modal
        }
    
        const handleEdit = (user) => {
            setModalMode('edit'); // Set modal to edit mode
            setSelectedUser(user); // Set the user to be edited
            setShowModal(true); // Show the modal
        }
    
        const handleClose = () => {
            setShowModal(false); // Hide the modal
        }

    // Loading state UI
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
                <div className="spinner-border spinner-border-lg text-primary">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    // Main component render
    return (
        <div className="container-fluid px-3 py-3">
            <div className="card  border-0 rounded-4">
                {/* Header section with title and description */}
                <div className={`${styles.colorP} card-header bg-gradient text-white rounded-top-4 p-4`} >
                    <div className="row align-items-center">
                        <div className="col">
                            <h3 className={`${styles.colorT} mb-1 d-flex align-items-center`}>
                                <i className={`bi bi-people-fill me-2`}></i> Users
                            </h3>
                            <p className={`${styles.colorT} mb-0 small `}>Complete gestion of registered users</p>
                        </div>
                    </div>
                </div>

                {/* Search and filter section */}
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
                                <i className="bi bi-plus-lg me-2"></i> Add User
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main table displaying users */}
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
                                {/*Conditional rendering based on whether ussers exist*/}
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
                                                {/*Dinamic badge styling based on user position*/}
                                            <span className={`badge rounded-pill px-3 py-2 ${
                                                !user.position || !user.position.status 
                                                ? styles.inactivePosition 
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
                                                <div className="btn-group">
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
                                    /* Empty state when no users are found */
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

                {/* Pagination footer  */}
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
                                    {/* Botón Previous */}
                                    <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
                                        <button
                                            className={`page-link navButton ${styles.navButton}`}
                                            onClick={() => currentPage > 1 && getUsers(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            Previous
                                        </button>
                                    </li>

                                    {/* Page number buttons */}
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <li 
                                            key={page} 
                                            className={`page-item${currentPage === page ? ' active ' + styles.activePage : ''}`}
                                        >
                                            <button
                                                className={`page-link ${styles.pageLink}`}
                                                onClick={() => getUsers(page)}
                                            >
                                                {page}
                                            </button>
                                        </li>
                                    ))}

                                    {/* Next page button */}
                                    <li className={`page-item ${currentPage === totalPages && 'disabled'}`}>
                                        <button
                                            className={`page-link navButton ${styles.navButton}`}
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
                {/*Conditionally render the user form modal*/}
            {showModal && (
                <UserFormModal
                    show={showModal}
                    userData={selectedUser}
                    handleClose={handleClose}
                    onSuccess={getUsers}  // Refresh list after successful operation
                    mode={modalMode} // Pass whether we're creating or editing
                />
            )}
        </div>
    );
};

export default ShowUsers;