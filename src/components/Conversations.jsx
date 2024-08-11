import { useConversations } from "../context/ConversationProvider.js";
import { ListGroup } from "react-bootstrap";

const Conversations = () => {
  const { conversations } = useConversations();
  return (
    <ListGroup variant="flush">
      {conversations.map((conversation, index) => {
        return (
          <ListGroup.Item key={index}>
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
