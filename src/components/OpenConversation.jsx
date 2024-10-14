import { useState, useEffect } from "react";
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

  const windowHeight = window.innerHeight;

  const moveToBottom = () => {
    const element = document.getElementById("message");
    element.scrollTop = element.scrollHeight;
  };

  useEffect(() => {
    moveToBottom();
  }, [selectedConversation.message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() === '') {
      showAlert({ title: "Please enter a message", icon: "error" });
      return;
    }
    socket.emit('send-message', { recipients, text, senderId: chatId });
    dispatch(addMessage(recipients, text, chatId));
    setText('');
  };

  return (
    <div style={{ width: "95%", margin: "10px 2.5%", padding: "10px" }}>
      <div id="message"
        style={{
          alignItems: "flex-start",
          justifyContent: "end",
          height: windowHeight - 180,
          width: "100%",
          overflowY: "auto",
          marginBottom: "10px",
          scrollBehavior: "smooth",
          // scrollbarWidth: "none",
        }}
      >
        {selectedConversation && selectedConversation.message &&  selectedConversation.message.map(
          (message, index) => {
            const SenderName = contactNamebyId(contacts, message.senderId);
            const isOwnMessage = message.senderId === chatId;
            return (
              <div style={{
                display: "flex",
                justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
              }} key={index}>
                <div
                  style={{
                    width: "fit-content",
                    maxWidth: "70%",
                    margin: "10px",
                    padding: "10px",
                    borderRadius: "10px",
                    backgroundColor: isOwnMessage ? "#2E8B57" : "#D3D3D3",
                    color: isOwnMessage ? "white" : "black",
                    fontSize: "20px",
                    textWrap: "wrap",
                  }}
                >
                  {message.text}
                  <div
                    style={{
                      marginTop: "5px",
                      fontSize: "10px",
                      color: "black",
                    }}
                  >
                    {isOwnMessage ? <div style={{ float: "right" }}>You</div> : <div>
                      {SenderName}
                      {SenderName === message.senderId ? <img src={copy} alt="" width="16px" style={{ marginLeft: "10px", cursor: "pointer" }} onClick={() => {
                        navigator.clipboard.writeText(SenderName);
                        showAlert({ title: "Id Copied", icon: "success" });
                      }} /> : null
                      }
                    </div>}
                  </div>
                </div>
              </div>
            )
          }
        )}
      </div>
      <div style={{ marginBottom: "10px", display: "flex", flexDirection: "row" }}>
        <Form.Control
          type="textarea"
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your message here"
          style={{ width: "100%", margin: "0 10px" }}
        />
        <Button variant="primary" onClick={handleSubmit} style={{ width: "100px", margin: "0 10px" }}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default OpenConversation;
