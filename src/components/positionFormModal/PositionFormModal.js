import React, {useState, useEffect} from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import {showAlert} from '../../functions'
import axios from 'axios'

const PositionFormModal = ({ show, handleClose, positionData, onSuccess, mode }) => {
    const [form, setForm] = useState({
        positionName: '',
        status: true,
    });
    
    useEffect(() => {
        if (mode === 'edit' && positionData) {
            setForm({
                positionName: positionData.positionName || '',
                status: positionData.status !== undefined ? positionData.status : true,
            });
        }else {
            setForm({
                positionName: '',
                status: true
            });
        }
    }, [mode, positionData]);

    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async () => {
        try{
            if(mode === 'edit'){
                await axios.put(`http://localhost:8080/api/positions/${positionData.positionId}`, form);
                showAlert('User edited successfully', 'success');
            }else {
                await axios.post('http://localhost:8080/api/positions/', form);
                showAlert('Position save successfully', 'success');
            }
            handleClose();
            onSuccess();
        } catch (e) {
            showAlert('Error to save position', 'error');
            console.error('Error:', e.response?.data || e.message);
        }
    };


  return (
    <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
            <Modal.Title>{mode === 'create' ? 'Creat Position' : 'Edit Position'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <input
                name="positionName"
                placeholder="Name"
                value={form.positionName}
                onChange={handleChange}
                className="form-control mb-3"
            />
            {mode === 'edit' && (
                <div className="form-check form-switch">
                    <input
                        name="status"
                        type="checkbox"
                        className="form-check-input"
                        checked={form.status}
                        onChange={handleChange}
                        id="statusSwitch"
                    />
                    <label className="form-check-label" htmlFor="statusSwitch">
                        {form.status ? 'Active' : 'Inactive'}
                    </label>
                </div>

            )}
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Cancel 
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
                {mode === 'create' ? 'Create' : 'Save Changes'}
            </Button>
        </Modal.Footer>
    </Modal>
  )
}

export default PositionFormModal