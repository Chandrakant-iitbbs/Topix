import { useState, useRef } from "react";
import { useContacts } from "../context/ContactProvider.js";
import { useConversations } from "../context/ConversationProvider.js";
import { Modal, Form, Button, FormLabel, Row } from "react-bootstrap";

const ConversationModal = (props) => {
  const { show, setShow } = props;

  const { contacts } = useContacts();
  const { createConversation } = useConversations();

  const idref = useRef();
  const nameref = useRef();
  const [selectedContactIds, setSelectedContactIds] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    createConversation(selectedContactIds);
    console.log(idref.current.value);
    console.log(nameref.current.value);
    setShow(false);
  };

  const handleCheckBoxChange = (id) => {
    setSelectedContactIds((prevSelectedContactIds) => {
      if (prevSelectedContactIds.includes(id)) {
        return prevSelectedContactIds.filter((prevId) => {
          return id !== prevId;
        });
      } else {
        return [...prevSelectedContactIds, id];
      }
    });
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
        <Modal.Title>Craete Conversations</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {contacts.map((contact) => (
            <Row style={{ marginLeft: "20px" }}>
              <FormLabel
                id={contact.id}
                onChange={() => handleCheckBoxChange(contact.id)}
                ref={idref}
              >
                <Form.Check
                  type={"checkbox"}
                  id={contact.id}
                  label={contact.name}
                  value={selectedContactIds.includes(contact.id)}
                  ref={nameref}
                />
              </FormLabel>
            </Row>
          ))}
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

export default ConversationModal;
