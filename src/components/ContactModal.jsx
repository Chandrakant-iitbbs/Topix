import { useRef } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { addContact } from "../Redux/Actions";
import { useDispatch } from "react-redux";
import showAlert from "../Functions/Alert";

const ContactModal = (props) => {
  const { show, setShow } = props;
  const dispatch = useDispatch();

  const idref = useRef();
  const nameref = useRef();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!idref.current.value || !nameref.current.value){
      showAlert({
        title: "Please fill all fields",
        icon: "error",
      });
      return;
    } 
    dispatch(addContact(idref.current.value, nameref.current.value));
    setShow(false);
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        setShow(false)
      }}
      backdrop="static"
      keyboard={true}
      animation={true}
    >
      <Modal.Header closeButton>
        <Modal.Title>Create contact</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Id</Form.Label>
            <Form.Control
              value={idref.current}
              ref={idref}
              type="text"
              placeholder="Enter id of new contact"
              autoFocus
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={nameref.current}
              ref={nameref}
              type="text"
              placeholder="Enter name of new contact"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={(e) => {
          e.preventDefault();
          setShow(false)}}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Create New
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ContactModal;
