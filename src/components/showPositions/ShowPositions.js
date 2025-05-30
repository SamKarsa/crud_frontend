//IMPORTS 
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { confirmAlert, showAlert, deletePosition } from '../../functions';
import PositionFormModal from '../positionFormModal/PositionFormModal';
import styles from '../showUsers/ShowUsers.module.css' // Custom CSS module


const ShowPositions = () => {
    //API base URL 
    const url = 'http://localhost:8080/api/positions';
    //STATE VARIABLES
    const [positions, setPositions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPositions, setFilteredPositions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create'); //'create' or 'edit'
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages,setTotalPages] = useState(1);

    const hasFetched=useRef(false); // Prevent double-fetching

    //INITIAL FETCH
    useEffect(() => {
        if (hasFetched.current) return;


        getPositions(currentPage);
        hasFetched.current=true;
    }, [searchTerm, currentPage]);

    //FILTERING POSITIONS BASED ON SEARCH
    useEffect(() => {
        setFilteredPositions(
            positions.filter(position =>
                position.positionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (position.status ? 'active' : 'disable').includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, positions]);

    //FETCH POSITIONS FROM API 
    const getPositions = async (page = 1, limit = 10 ) => {
        try {
            setLoading(true);

            const response = await axios.get(`${url}?page=${page}&limit=${limit}`);


            setPositions(response.data.positions || response.data.rows || []);
            setFilteredPositions(response.data.positions || response.data.rows || []);
            setCurrentPage(response.data.currentPage || page);
            setTotalPages(response.data.totalPages || 1 );

        } catch (error) {
                console.error('Error fetching positions:', error);
                showAlert('Error fetching the positions', 'error');
        } finally {
                setLoading(false);
        }
    };

    //HANDLE DELETE WITH CONFIRMATION
    const handleDeletePosition = async (positionid) => {
        const confirmed = await confirmAlert('Are you sure you want to delete this position?');
        if (!confirmed) return;
        getPositions();

    try {
        await deletePosition(positionid);
        showAlert('Position deleted succesfully', 'success');
        getPositions();
        //Actualizar el estado
        await getPositions(currentPage); // Refresh after deletion

    } catch (e) {
        showAlert('Error deleting position', 'error');
        console.error('Delete error;', e);
    }
}

    //OPEN MODAL FOR CREATION
    const handleCreate = () => {
        setModalMode('create');
        setSelectedPosition(null);
        setShowModal(true);
    }

    //OPEN MODAL FOR EDITING
    const handleEdit = (position) => {
        setModalMode('edit');
        setSelectedPosition(position);
        setShowModal(true);
    }
    
    const handleClose = () => {
        setShowModal(false);
    }

    if (loading) {
        return <div>Loading...</div>;
    }


    return (    
        <div className="container-fluid px-3 py-3">
            <div className="card border-0 rounded-4">
                <div className="card-header bg-gradient text-dark rounded-top-4 p-4 mb-3" >
                    <div className="row align-items-center">
                        <div className="col">
                            <h3 className="mb-1 d-flex align-items-center">
                                <i className="bi bi-briefcase-fill me-2"></i> Positions
                            </h3>
                            <p className="mb-0 small">All Business positions</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="card-body bg-light bg-opacity-25 border-bottom">
                <div className="row g-3 align-items-center mb-3 px-3">
                    <div className="col-md-5">
                        <div className="input-group">
                            <span className="input-group-text bg-white border-end-0">
                                <i className="bi bi-search text-muted"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control border-start-0"
                                    placeholder="Search positions..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                        </div>
                    </div>
                    <div className="col-md-7 text-md-end">
                        <button onClick={handleCreate} className={`${styles.colorB} fw-semibold px-4 py-2 rounded-pill `}>
                            <i className="bi bi-plus-lg me-2"></i> Add Position
                        </button>
                    </div>
                </div>
            </div>

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
                                <th>Position Name</th>
                                <th>Status</th>
                                <th className="text-end pe-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPositions.length > 0 ? (
                                filteredPositions.map(position => (
                                    <tr key={position.positionId}>
                                        <td className="ps-4 fw-semibold text-dark">{position.positionId}</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div>
                                                    <h6 className="mb-0">{position.positionName}</h6>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                        <span className={`badge rounded-pill ${position.status ? styles.activeStatus : styles.disableStatus} fs-6  px-3 py-1`}>
                                            <p className="mb-0">{position.status ? 'Active' : 'Disable'}</p>
                                        </span>
                                        </td>
                                        <td className="text-end pe-4">
                                            <div className="btn-group">
                                                <button onClick={() => handleEdit(position)} className="btn btn-outline-primary btn-sm rounded-start" title="Edit Position">
                                                    <i className="bi bi-pencil-square"></i>
                                                </button>
                                                <button className="btn btn-outline-danger btn-sm rounded-end" title="Delete Position" onClick={() => handleDeletePosition(position.positionId)}>
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
                                                    <i className="bi bi-briefcase"></i>
                                                </div>
                                                <h4 className="text-muted">Not found positions</h4>
                                                <p className="text-muted mb-4">
                                                    {searchTerm
                                                        ? 'No results found for your search, try different terms.'
                                                        : 'Add new positions to start working with the system.'}
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
                    <div className="card-footer bg-white rounded-bottom-4 p-3">
                        <div className="row align-items-center">
                            <div className="col-md-6">
                                <span className="text-muted">
                                    Showing <strong>{filteredPositions.length}</strong> positions on page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                                </span>
                            </div>
                            <div className="col-md-6">
                                <nav aria-label="..." className="float-md-end">
                                    <ul className="pagination">
                                        {/* Botón Previous */}
                                        <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
                                            <button
                                                className={`page-link navButton ${styles.navButton}`}
                                                onClick={() => currentPage > 1 && getPositions(currentPage - 1)}
                                                disabled={currentPage === 1}
                                            >
                                                Previous
                                            </button>
                                        </li>
    
                                        {/* Botones de página */}
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                            <li 
                                                key={page} 
                                                className={`page-item${currentPage === page ? ' active ' + styles.activePage : ''}`}
                                            >
                                                <button
                                                    className={`page-link ${styles.pageLink}`}
                                                    onClick={() => getPositions(page)}
                                                >
                                                    {page}
                                                </button>
                                            </li>
                                        ))}
    
                                        {/* Botón Next */}
                                        <li className={`page-item ${currentPage === totalPages && 'disabled'}`}>
                                            <button
                                                className={`page-link navButton ${styles.navButton}`}
                                                onClick={() => currentPage < totalPages && getPositions(currentPage + 1)}
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

            {/*CREATE/EDIT MODAL*/}
            {showModal && (
                <PositionFormModal
                    show={showModal}
                    positionData={selectedPosition}
                    handleClose={handleClose}
                    onSuccess={getPositions}
                    mode={modalMode}
                />
            )}
        </div>
    );
};

export default ShowPositions;