import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export function show_alerts(msj, icon, focus=''){
    onFocus(focus);
    const Alert = withReactContent(Swal);
    Alert.fire({
        title:msj,
        icon:icon
    });
}

function onFocus(focus){
    if(focus !== ''){
        document.getElementById(focus).focus();
    }
}