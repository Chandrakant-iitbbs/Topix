import { useState, useRef } from "react";
import { useContacts } from "../context/ContactProvider.js";
import { useConversations } from "../context/ConversationProvider.js";
import { Modal, Form, Button, FormLabel, Row } from "react-bootstrap";

const ConversationModal = (props) => {
  const { show, setShow } = props;
  const [selectedContactIds, setSelectedContactIds] = useState([])
  const { contacts } = useContacts()
  const { createConversation } = useConversations();

  const idref = useRef();
  const nameref = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    createConversation(selectedContactIds)
    setShow(false);
  };

  const handleCheckBoxChange = (chatId) => {
    setSelectedContactIds((prevSelectedContactIds) => {
      if (prevSelectedContactIds.includes(chatId)) {
        return prevSelectedContactIds.filter((prevId) => {
          return chatId !== prevId;
        });
      } else {
        return [...prevSelectedContactIds, chatId];
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
          {contacts.map((contact,index) => (
            <Row key={index} style={{ marginLeft: "20px" }}>
              <FormLabel
                chatId={contact.chatId}
                onChange={() => handleCheckBoxChange(contact.chatId)}
                ref={idref}
              >
                <Form.Check
                  type={"checkbox"}
                  chatId={contact.chatId}
                  label={contact.name}
                  value={selectedContactIds.includes(contact.chatId)}
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
