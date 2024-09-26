import { useRef } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useContacts } from "../context/ContactProvider";

const ContactModal = (props) => {
  const { show, setShow } = props;
  const { createContact } = useContacts();
  const idref = useRef();
  const nameref = useRef();
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(idref.current.value, nameref.current.value);
    createContact(idref.current.value, nameref.current.value);
    setShow(false);
  };

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
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
        <Button variant="secondary" onClick={() => setShow(false)}>
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
