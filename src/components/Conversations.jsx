import { useNavigate } from "react-router-dom";
import { useConversations } from "../context/ConversationProvider.js";
import { ListGroup } from "react-bootstrap";


const Conversations = () => {
  const navigate = useNavigate();
  const { conversations, setSelectedIndex } = useConversations();

  return (
    <ListGroup variant="flush">
      {conversations.map((conversation, index) => {
        return (
          <ListGroup.Item
            key={index}
            onClick={(e) => {
              setSelectedIndex(index);
              e.preventDefault();
              navigate("/chat");

            }}
          >
            {conversation.recipients
              .map((recipient) => recipient.name)
              .join(", ")}
          </ListGroup.Item>
        );
      })}
    </ListGroup>
  );
};

export default Conversations;
