import { useState, useRef } from "react";
import { Modal, Form, Button, FormLabel, Row } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { addConversations } from "../Redux/Actions.js"
import showAlert from "../Functions/Alert";

const ConversationModal = (props) => {
  const { show, setShow } = props;
  const [contactIds, setContactIds] = useState([])
  const contacts = useSelector((state) => state.contacts);
  const dispatch = useDispatch();

  const idref = useRef();
  const nameref = useRef();

  const handleCheckBoxChange = (chatId) => {
    setContactIds((prevContactIds) => {
      if (prevContactIds.includes(chatId)) {
        return prevContactIds.filter((prevId) => {
          return chatId !== prevId;
        });
      } else {
        return [...prevContactIds, chatId];
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (contactIds.length === 0) {
      showAlert({
        title: "Please select at least one contact",
        icon: "error",
      });
      return;
    }
    dispatch(addConversations(contactIds, []))
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
        <Modal.Title>Create Conversations</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {contacts.map((contact, index) => (
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
                  value={contactIds.includes(contact.chatId)}
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
        <Button variant="primary" onClick={(e) => handleSubmit(e)}>
          Create New
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConversationModal;
