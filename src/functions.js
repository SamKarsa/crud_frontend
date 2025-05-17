import swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';



export function showAlert(message,icon,focus=''){
    onfocus(focus);
    const Myswal = withReactContent(swal);
    Myswal.fire({
        title:message,
        icon:icon,
    })
}

export async function confirmAlert(message){
    const result = await swal.fire({
        title: message,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
    })
    return result.isConfirmed;
}

function onfocus(focus){
    if(focus !== ''){
        document.getElementById(focus).focus();
    }
}


const delete_url='http://localhost:8080/api/users';

export async  function deleteUser(id){
    try {
        const response = await axios.delete(`${delete_url}/${id}`);
        return response.data;
    }catch (e) {
        throw new Error('Error deleting user:' + e.message)
    }
}

const deletePosition_url = 'http://localhost:8080/api/positions';

export async function deletePosition(id){
    try{
        const response = await axios.delete(`${deletePosition_url}/${id}`);
            return response.data;
    }catch (e) {
        throw new Error('Error delete position: ' + e.message);
    }
}
