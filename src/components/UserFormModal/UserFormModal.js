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
                    setPositions(response.data);
                } catch (error) {
                    showAlert('Error al cargar los roles', 'error');
                }
            };

            fetchPositions();
        }, []);


    const handleChange = e => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async () =>{
        try{
            if (mode === 'edit'){
                await axios.put(`http://localhost:8080/api/users/${userData.id}`, form);
                showAlert('User updated successfully', 'success');
            }else{
                await axios.post('http://localhost:8080/api/users/', form);
                showAlert('User created successfully', 'success');
                
            }
            handleClose();
            onSuccess();
        }catch (e){
            showAlert('Error saving user', 'error');
            console.log('Payload que se envía:', userData);
        }
    };



    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{mode === 'create' ? 'Crear Usuario' : 'Editar Usuario'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <input
                    name="firstName"
                    placeholder="Nombre"
                    value={form.firstName}
                    onChange={handleChange}
                    className="form-control mb-2"
                />
                <input
                    name="lastName"
                    placeholder="Apellido"
                    value={form.lastName}
                    onChange={handleChange}
                    className="form-control mb-2"
                />
                <input
                    name="email"
                    placeholder="Correo"
                    value={form.email}
                    onChange={handleChange}
                    className="form-control mb-2"
                />
                <input
                    name="phone"
                    placeholder="Teléfono"
                    value={form.phone}
                    onChange={handleChange}
                    className="form-control mb-2"
                />
                {mode === 'create' && (
                    <>
                        <input
                            name="age"
                            type="number"
                            placeholder="Edad"
                            value={form.age}
                            onChange={handleChange}
                            className="form-control mb-2"
                        />
                        <input
                            name="password"
                            type="password"
                            placeholder="Contraseña"
                            value={form.password}
                            onChange={handleChange}
                            className="form-control mb-2"
                        />
                    </>
                )}
                <select
                    name="positionId"
                    value={form.positionId}
                    onChange={handleChange}
                    className="form-control mb-2"
                >
                    <option value="">Seleccione una posición</option>
                    {positions.map(pos => (
                        <option key={pos.positionId} value={pos.positionId}>
                            {pos.positionName}
                        </option>
                    ))}
                </select>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    {mode === 'create' ? 'Crear' : 'Guardar cambios'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default UserFormModal;