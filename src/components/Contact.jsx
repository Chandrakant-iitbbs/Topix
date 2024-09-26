import { useContacts } from "../context/ContactProvider.js";
import { ListGroup } from "react-bootstrap"

const Contact = () => {
const { contacts } = useContacts();
  return (
    <ListGroup variant="flush">
      {contacts.map((contact) => {
        return <ListGroup.Item key={contact.chatId}>{contact.name}</ListGroup.Item>;
      })}
    </ListGroup>
  );
};

export default Contact;
