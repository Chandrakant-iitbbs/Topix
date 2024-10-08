import swal from 'sweetalert';

const showPrompt = ({ title }) => {
    return swal({
        title: title,
        closeOnClickOutside: false,
        closeOnEsc:true,
        buttons: {
            cancel: "Cancel",
            confirm: {
                closeModal: true,
            },
        },
        content: {
            element: "input",
            attributes: {
                placeholder: "Type your tag here",
            },
        },
    });
}

export default showPrompt;