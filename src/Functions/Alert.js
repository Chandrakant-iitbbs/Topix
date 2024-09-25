import swal from "sweetalert";
const showAlert = ({ title, icon }) => {
  return swal({
    title: title,
    icon: icon,
  });
};

export default showAlert;
