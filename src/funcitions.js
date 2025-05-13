import swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export function showAlert(message,icon,focus){
    onfocus(focus);
    const Myswal = withReactContent(swal);
    Myswal.fire({
        title:message,
        icon:icon,
    })
}

function onfocus(focus){
    if(focus !== ''){
        document.getElementById(focus).focus();
    }
}