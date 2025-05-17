import React, {useState, useEffect,useRef} from "react";
import Modal from  'react-bootstrap/Modal';
import Button from  'react-bootstrap/Button';
import {showAlert} from '../../functions';
import axios from 'axios';

const UserFormModal = ({show,handleClose, userData, onSuccess,mode}) => {

    const [form,setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    positionId: '',
    password: '',
    });

    const [positions, setPositions] = useState([]);

    useEffect(() => {
        if (mode === 'edit' && userData) {
            setForm({
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                email: userData.email || '',
                phone: userData.phone || '',
                positionId: userData.positionId || '',
            });
        } else {
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
    }, [mode, userData]);


        const hasFetched = useRef(false);

        useEffect(() => {
            if (hasFetched.current) return; // Si ya se ejecutó, no vuelvas a hacerlo
            hasFetched.current = true; // Marca como ejecutado

            const fetchPositions = async () => {
                try {
                    const response = await axios.get('http://localhost:8080/api/positions');
                    const activePositions = response.data.filter(position => position.status === true);
                    setPositions(activePositions);
                } catch (error) {
                    showAlert('Error al cargar los roles', 'error');
                }
            };

            fetchPositions();
        }, []);


    const [errors, setErrors] = useState({});

    const validateForm = (name,value) => {

        const newErrors = {...errors};

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

            if (name === 'email'){
                if (!value){
                    newErrors.email = 'The email is required';
                }else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)){
                    newErrors.email = 'The email is not valid';
                }else{
                    delete newErrors.email;
                }
            }

            if (name === 'phone'){
                if (!/^\d{10}$/.test(value)){
                    newErrors.phone = 'The phone number must be 10 digits';
                }else{
                    delete newErrors.phone;
                }
            }

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

            if (name === 'password'){
                if (!value){
                    newErrors.password = 'The password is required';
                }else if (value.length < 8){
                    newErrors.password = 'The password must be at least 8 characters';
                }else {
                    delete newErrors.password;
                }
            }

            if (name === 'positionId'){
                if (!value){
                    newErrors.positionId = 'The position is required';
                }else{
                    delete newErrors.positionId;
                }
            }
            
            setErrors(newErrors);
    }

        const handleChange = e => {
        const { name, value } = e.target;
        
        let formattedValue = value;
        
        // Formatear nombres y apellidos (primera letra mayúscula)
        if (name === 'firstName' || name === 'lastName') {
            formattedValue = value.toLowerCase().replace(/(^|\s|'|-)\w/g, char => char.toUpperCase());
        }
        
        // Forzar minúsculas en email
        if (name === 'email') {
            formattedValue = value.toLowerCase().trim();
        }

        setForm({
            ...form,
            [name]: formattedValue
        });

        validateForm(name, formattedValue);
        };

        const handleSubmit = async () => {

            Object.keys(form).forEach((key) => validateForm(key, form[key]));

            if (Object.keys(errors).length > 0) {
                showAlert('Please correct any errors before submitting..', 'error');
                return;
            }

            try {
                if (mode === 'edit') {
                    await axios.put(`http://localhost:8080/api/users/${userData.id}`, form);
                    showAlert('User updated successfully', 'success');
                } else {
                    await axios.post('http://localhost:8080/api/users/', form);
                    showAlert('User created successfully', 'success');
                }
                handleClose();
                onSuccess();
            } catch (e) {
                showAlert('Error saving user', 'error');
                console.log('Payload que se envía:', userData);
            }
        };



    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{mode === 'create' ? 'Create users' : 'Edit users'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <input
                    name="firstName"
                    placeholder="Nombre"
                    value={form.firstName}
                    onChange={handleChange}
                    className={`form-control mb-2 ${errors.firstName ? 'is-invalid': ''}`}
                />
                {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                <input
                    name="lastName"
                    placeholder="Apellido"
                    value={form.lastName}
                    onChange={handleChange}
                    className={`form-control mb-2 ${errors.lastName ? 'is-invalid': ''}`}
                />
                {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                <input
                    name="email"
                    placeholder="Correo"
                    value={form.email}
                    onChange={handleChange}
                    className={`form-control mb-2 ${errors.email ? 'is-invalid': ''}`}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                <input
                    name="phone"
                    placeholder="Teléfono"
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
                            placeholder="Edad"
                            value={form.age}
                            onChange={handleChange}
                            className={`form-control mb-2 ${errors.age ? 'is-invalid': ''}`}
                        />
                        {errors.age && <div className="invalid-feedback">{errors.age}</div>}
                        <input
                            name="password"
                            type="password"
                            placeholder="Contraseña"
                            value={form.password}
                            onChange={handleChange}
                            className={`form-control mb-2 ${errors.password ? 'is-invalid': ''}`}
                        />
                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </>
                )}
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