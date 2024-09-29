import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { addMessage } from "../Redux/Actions";
import { contactNamebyId } from "../Functions/ContactIdToContactName";
import copy from "../Assets/clone-regular.svg";
import showAlert from "../Functions/Alert";

const OpenConversation = () => {
  const [text, setText] = useState('');
  const ChatIndex = useSelector(state => state.ChatIndex);
  const conversations = useSelector(state => state.conversations);

  const selectedConversation = conversations.length > 0 ? conversations[ChatIndex] : { ContactIds: [], message: [] };

  const contacts = useSelector(state => state.contacts);
  const chatId = useSelector(state => state.ChatId);
  const recipients = selectedConversation.ContactIds;

  const socket = useSelector(state => state.socket);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() === '') return
    socket.emit('send-message', { recipients, text, senderId: chatId });
    dispatch(addMessage(recipients, text, chatId));
    setText('');
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
            (message, index) => {
              const SenderName = contactNamebyId(contacts, message.senderId);
              return (
                <div
                  key={index}
                  style={{
                    margin: "10px",
                    padding: "10px",
                    borderRadius: "10px",
                    backgroundColor: message.senderId === chatId ? "#2E8B57" : "#D3D3D3",
                    color: message.senderId === chatId ? "white" : "black",
                    fontSize: "20px",
                    alignSelf: message.senderId === chatId ? "flex-end" : "flex-start",
                    alignItems: message.senderId === chatId ? "end" : "flex-start",
                  }}
                >
                  {message.text}
                  <div
                    style={{
                      fontSize: "10px",
                      color: "black",
                      alignSelf: message.senderId === chatId ? "flex-end" : "flex-start",
                    }}
                  >
                    {message.senderId === chatId ? "You" : <div>
                      {SenderName}
                      {SenderName === message.senderId ? <img src={copy} alt ="" width="16px" style={{ marginLeft: "10px", cursor: "pointer" }} onClick={() => {
                        navigator.clipboard.writeText(SenderName);
                        showAlert({ title: "Id Copied", icon: "success" });
                      }} />:null
                      }
                    </div> }
                  </div>
                </div>
              )
            }
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
