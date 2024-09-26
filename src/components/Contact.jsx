import { useSelector } from "react-redux";
import { ListGroup } from "react-bootstrap"

const Contact = () => {
const contacts = useSelector((state) => state.contacts);
return (
    <ListGroup variant="flush">
      {contacts && contacts.map((c) => {
        return <ListGroup.Item key={c.chatId}>{c.name}</ListGroup.Item>;
      })}
    </ListGroup>
  );
};

export default Contact;
