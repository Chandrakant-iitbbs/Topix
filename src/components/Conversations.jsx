import { useNavigate } from "react-router-dom";
import { ListGroup } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { setChatIndex } from "../Redux/Actions";

const Conversations = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const conversations = useSelector((state) => state.conversations);
  const contacts = useSelector((state) => state.contacts);

  return (
    <ListGroup variant="flush" style={{ margin: "0.5rem 0" }}>
      {conversations && conversations.length > 0 ? (
        conversations.map((conversation, index) => {
          return (
            <ListGroup.Item
              key={index}
              onClick={(e) => {
                e.preventDefault();
                dispatch(setChatIndex(index));
                navigate("/chat/" + index);
              }}
            >
              {conversation.ContactIds.map((contactId) => {
                const contact = contacts.find(
                  (contact) => contact.chatId === contactId
                );
                return (contact && contact.name) || contactId;
              }).join(", ")}
            </ListGroup.Item>
          );
        })
      ) : (
        <h3>No conversations</h3>
      )}
    </ListGroup>
  );
};

export default Conversations;
