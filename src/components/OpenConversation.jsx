import { useState } from "react";
import { useConversations } from "../context/ConversationProvider";
import { Form, Button } from "react-bootstrap";

const OpenConversation = () => {
  const [text, setText] = useState('')
  const { sendMessage , selectedConversation } = useConversations();
  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(
      selectedConversation.recipients.map(r => r.chatId),
      text
    )
    setText('')
  };

  return (
    <div>
      <div>
        <div
          style={{
            marginTop: "1000px",
            height: "30px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "end",
            padding: "20px",
            marginbutton: "10px",
          }}
        >
          {selectedConversation.message.map(
            (message, index) => (
              <div
                key={index}
                style={{
                  margin: "10px",
                  padding: "10px",
                  borderRadius: "10px",
                  backgroundColor: message.fromMe ? "#2E8B57" : "#D3D3D3",
                  color: message.fromMe ? "white" : "black",
                  fontSize: "20px",
                  alignSelf: message.fromMe ? "flex-end" : "flex-start",
                  alignItems: message.fromMe ? "end" : "flex-start",
                }}
              >
                {message.text}
                <div
                  style={{
                    fontSize: "10px",
                    color: "black",
                    alignSelf: message.fromMe ? "flex-end" : "flex-start",
                  }}
                >
                  {message.fromMe ? "You" : message.senderName}
                </div>
              </div>
            )
          )}
        </div>
      </div>

      <Form.Label>Text</Form.Label>
      <Form.Control
        type="textarea"
        id="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button variant="primary" onClick={handleSubmit}>
        Send
      </Button>
    </div>
  );
};

export default OpenConversation;
