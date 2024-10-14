import { useSelector } from "react-redux";
import { ListGroup } from "react-bootstrap"

const Contact = () => {
const contacts = useSelector((state) => state.contacts);
return (
    <ListGroup variant="flush" style={{margin:"0.5rem 0"}}>
      {contacts && contacts.length>0 ? contacts.map((c) => {
        return <ListGroup.Item key={c.chatId}>{c.name}</ListGroup.Item>;
      }): <h3>
        No contacts
        </h3>}
    </ListGroup>
  );
};

export default Contact;
