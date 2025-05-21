import React, {useState, useEffect,useRef} from "react";
import Modal from  'react-bootstrap/Modal';
import Button from  'react-bootstrap/Button';
import {showAlert} from '../../functions';
import axios from 'axios';

//Modal component for creating/editing users
const UserFormModal = ({show,handleClose, userData, onSuccess,mode}) => {

    //Forrm state management
    const [form,setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    positionId: '',
    password: '',
    });

    //State for avaliable positions dropdown
    const [positions, setPositions] = useState([]);

    //Effect to initialize form data based on mode (create/edit)
    useEffect(() => {
        if (mode === 'edit' && userData) {
            //Pre-fill form with existing user data for editing
            setForm({
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                email: userData.email || '',
                phone: userData.phone || '',
                positionId: userData.positionId || '',
                //Note: Age and password arer intentionally left empty in edit mode
            });
        } else {
            // Reset form for create mode
            setForm({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                age: '',
                positionId: '',
                password: '',
            });
        }
    }, [mode, userData]); // Re-run when mode or userData changes

        // Effect to fetch positions when modal opens
        useEffect(() => {
            const fetchPositions = async () => {
                try {
                    const response = await axios.get('http://localhost:8080/api/positions/all');
                    
                    console.log('API Response:', response.data); // Debug logging
                    
                    // Handle different API response structures
                    let receivedPositions = response.data;
                    
                    // Some APIs wrap data in a 'data' property
                    if (response.data && response.data.data) {
                        receivedPositions = response.data.data;
                    }
                    
                    // Filter active positions and normalize structure
                    const activePositions = receivedPositions
                        .filter(position => position.status === true)
                        .map(position => ({
                            positionId: position.id || position.positionId, // Handle different ID fields
                            positionName: position.positionName,
                            status: position.status
                        }));
                        
                    console.log('Processed Positions:', activePositions); // Debug logging
                    setPositions(activePositions);
                    
                } catch (error) {
                    console.error('Error fetching positions:', error);
                    showAlert('Error loading positions: ' + error.message, 'error');
                }
            };

            // Only fetch when modal is shown
            if (show) {
                fetchPositions();
            }
        }, [show]); // Trigger when modal visibility changes

    // Form validation errors state
    const [errors, setErrors] = useState({});

    // Comprehensive form validation function
    const validateForm = (name,value) => {

        const newErrors = {...errors};

            // First name validation
            if (name === 'firstName'){
                if (!value){
                    newErrors.firstName = 'The first name is required';
                }else if (value.length < 3){
                    newErrors.firstName = 'The first name must be at least 3 characters';
                }else if (value.length > 50){
                    newErrors.firstName = 'The first name must be at most 50 characters';
                }else{
                    delete newErrors.firstName;
                }
            }

            // Last name validation (same rules as first name)
            if (name === 'lastName'){
                if (!value){
                    newErrors.lastName = 'The last name is required';
                }else if (value.length < 3){
                    newErrors.lastName = 'The last name must be at least 3 characters';
                }else if (value.length > 50){
                    newErrors.lastName = 'The last name must be at most 50 characters';
                }else{
                    delete newErrors.lastName;
                }
            }

            // Email validation
            if (name === 'email'){
                if (!value){
                    newErrors.email = 'The email is required';
                }else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)){
                    newErrors.email = 'The email is not valid';
                }else{
                    delete newErrors.email;
                }
            }

            // Phone validation (10 digits only)
            if (name === 'phone'){
                if (!/^\d{10}$/.test(value)){
                    newErrors.phone = 'The phone number must be 10 digits';
                }else{
                    delete newErrors.phone;
                }
            }

            // Age validation (18-80 range)
            if (name === 'age'){
                if (!value){
                    newErrors.age = 'The age is required';
                }else if (isNaN(value)){
                    newErrors.age = 'The age must be a number';
                }else if (value < 18 || value > 80){
                    newErrors.age = 'The age must be between 18 and 80'
                }else{
                    delete newErrors.age;
                }
                }

            // Password validation (only in create mode)
            if (name === 'password'){
                if (!value){
                    newErrors.password = 'The password is required';
                }else if (value.length < 8){
                    newErrors.password = 'The password must be at least 8 characters';
                }else {
                    delete newErrors.password;
                }
            }

            // Position validation
            if (name === 'positionId'){
                if (!value){
                    newErrors.positionId = 'The position is required';
                }else{
                    delete newErrors.positionId;
                }
            }
            
            setErrors(newErrors);
    }

        // Form input change handler
        const handleChange = e => {
        const { name, value } = e.target;
        
        let formattedValue = value;
        
        // Format names (capitalize first letters)
        if (name === 'firstName' || name === 'lastName') {
            formattedValue = value.toLowerCase().replace(/(^|\s|'|-)\w/g, char => char.toUpperCase());
        }
        
        // Format email (lowercase and trim)
        if (name === 'email') {
            formattedValue = value.toLowerCase().trim();
        }

        // Update form state
        setForm({
            ...form,
            [name]: formattedValue
        });

        // Validate the changed field
        validateForm(name, formattedValue);
        };

        // Form submission handler
        const handleSubmit = async () => {

            Object.keys(form).forEach((key) => validateForm(key, form[key]));

            // Check for errors
            if (Object.keys(errors).length > 0) {
                showAlert('Please correct any errors before submitting..', 'error');
                return;
            }

            try {
                // Determine if we're creating or updating
                if (mode === 'edit') {
                    await axios.put(`http://localhost:8080/api/users/${userData.id}`, form);
                    showAlert('User updated successfully', 'success');
                } else {
                    await axios.post('http://localhost:8080/api/users/', form);
                    showAlert('User created successfully', 'success');
                }
                // Close modal and refresh parent component
                handleClose();
                onSuccess();
            } catch (e) {
                showAlert('Error saving user', 'error');
                console.log('Payload que se envía:', userData); // Debug logging
            }
        };

    // Modal JSX rendering
    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{mode === 'create' ? 'Create users' : 'Edit users'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <input
                    name="firstName"
                    placeholder="First name"
                    value={form.firstName}
                    onChange={handleChange}
                    className={`form-control mb-2 ${errors.firstName ? 'is-invalid': ''}`}
                />
                {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                <input
                    name="lastName"
                    placeholder="Last name"
                    value={form.lastName}
                    onChange={handleChange}
                    className={`form-control mb-2 ${errors.lastName ? 'is-invalid': ''}`}
                />
                {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                <input
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className={`form-control mb-2 ${errors.email ? 'is-invalid': ''}`}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                {/*Phone Input*/}
                <input
                    name="phone"
                    placeholder="Phone"
                    value={form.phone}
                    onChange={handleChange}
                    className={`form-control mb-2 ${errors.phone ? 'is-invalid': ''}`}
                />
                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                {mode === 'create' && (
                    <>
                        <input
                            name="age"
                            type="number"
                            placeholder="Age"
                            value={form.age}
                            onChange={handleChange}
                            className={`form-control mb-2 ${errors.age ? 'is-invalid': ''}`}
                        />
                        {errors.age && <div className="invalid-feedback">{errors.age}</div>}
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            className={`form-control mb-2 ${errors.password ? 'is-invalid': ''}`}
                        />
                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </>
                )}
                {/*Position Dropdown*/}
                <select
                    name="positionId"
                    value={form.positionId}
                    onChange={handleChange}
                    className={`form-control mb-2 ${errors.positionId ? 'is-invalid': ''}`}
                >
                    <option value="">Select a position</option>
                    {positions.map(pos => (
                        <option key={pos.positionId} value={pos.positionId}>
                            {pos.positionName}
                        </option>
                    ))}
                </select>
                {errors.positionId && <div className="invalid-feedback">{errors.positionId}</div>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    {mode === 'create' ? 'Create' : 'Save changes'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default UserFormModal;