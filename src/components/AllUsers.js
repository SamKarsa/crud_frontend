import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { showAlert } from '../funcitions';

const ShowUsers = () => {
    const url = 'http://localhost:8080/api/users';
    const [users, setUsers] = useState([]);

    // Cargar usuarios al montar componente
    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = async () => {
        try {
            const response = await axios.get(url);
            setUsers(response.data);
        } catch (error) {
            showAlert('Error al cargar los usuarios', 'error');
        }
    };


    return (
        <div className="container">
            <h2>Lista de Usuarios</h2>
            <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', textAlign: 'left' }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Email</th>
                        <th>Edad</th>
                        <th>Teléfono</th>
                        <th>Position ID</th>
                        <th>Rol</th>
                        <th>Fecha creación</th>
                        <th>Última modificación</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? users.map(user => (
                        <tr key={user.Id}>
                            <td>{user.Id}</td>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.email}</td>
                            <td>{user.age}</td>
                            <td>{user.phone}</td>
                            <td>{user.positionId}</td>
                            <td>{user.position?.positionName || 'N/A'}</td>
                            <td>{new Date(user.createdAt).toLocaleString()}</td>
                            <td>{new Date(user.updatedAt).toLocaleString()}</td>
                            <td>
                                <button >✏️ Editar</button>
                                <button >🗑️ Eliminar</button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="11">No hay usuarios disponibles</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default ShowUsers;