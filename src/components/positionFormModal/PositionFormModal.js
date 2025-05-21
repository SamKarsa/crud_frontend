//IMPORTS 
import React, {useState, useEffect} from 'react'
import Modal from 'react-bootstrap/Modal' // Bootstrap modal component
import Button from 'react-bootstrap/Button' // Bootstrap button component
import {showAlert} from '../../functions' // Custom alert utility
import axios from 'axios' // HTTP client

//PositionFormModal component allows for creating or editing a position.
const PositionFormModal = ({ show, handleClose, positionData, onSuccess, mode }) => {
    //FORM STATE
    const [form, setForm] = useState({
        positionName: '',
        status: true,
    });
    
    const [originalForm, setOriginalForm] = useState({}); // Store original data to detect changes

    //INITIALIZE FORM BASED ON MODE AND DATA
    useEffect(() => {
        if (mode === 'edit' && positionData) {
            const formData = {
                positionName: positionData.positionName || '',
                status: positionData.status !== undefined ? positionData.status : true,
            };
            setForm(formData);
            setOriginalForm(formData); // Store original data for comparison
            
        } else {
            //Reset for create mode
            setForm({
                positionName: '',
                status: true
            });
            setOriginalForm({}); // Reset original form
        }
    }, [mode, positionData]);

    const [errors, setErrors]= useState({});

    //VALIDATION FUNCTION
    const validate= (name, value) => {

        const newErrors = {...errors};

        if (name === 'positionName'){
            if (!value){
                newErrors.positionName = 'Position name is required';
            }else if (value.length < 3 || value.length > 50){
                newErrors.positionName = 'Position name must be between 3 and 50 characters';
            }else{
                delete newErrors.positionName;
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    //HANDLE INPUT CHANGES
    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        // Auto-capitalize words in positionName
        let formattedValue = value;

        if (name === 'positionName') {
            formattedValue = value.toLowerCase().replace(/(^|\s|'|-)\w/g, char => char.toUpperCase());
        }

        setForm({
            ...form,
            [name]: type === 'checkbox' ? checked : formattedValue
        });

        validate(name,formattedValue);
    };

    //HANDLE FORM SUBMISSION
    const handleSubmit = async () => {
        const ispositionNameValid = validate('positionName', form.positionName);

        if (!ispositionNameValid){
            showAlert('Please fix the errors before submitting', 'error');
            return;
        }

        try {
            if (mode === 'create') {
                //CREATE NEW POSITION
                await axios.post('http://localhost:8080/api/positions/', form);
                showAlert('Position saved successfully', 'success');
            } else {
                //UPDATE EXISTING POSITION
                const changedFields = {};
                let hasChanges = false;
                
                // Compare current form with original data
                Object.keys(form).forEach(key => {
                    if (form[key] !== originalForm[key]) {
                        changedFields[key] = form[key];
                        hasChanges = true;
                    }
                });
                
                if (!hasChanges) {
                    handleClose(); // No changes to save
                    return;
                }
                
                await axios.put(`http://localhost:8080/api/positions/${positionData.positionId}`, changedFields);
                showAlert('Position updated successfully', 'success');
            }
            handleClose(); //Close modal
            onSuccess(); // Refresh parent list
        } catch (e) {
            showAlert(e.response?.data?.message || 'Error saving position', 'error');
            console.error('Error:', e.response?.data || e.message);
        }
    };

    //RENDER MODAL
    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{mode === 'create' ? 'Create Position' : 'Edit Position'}</Modal.Title>
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