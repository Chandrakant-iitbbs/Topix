import { useState } from "react";
import Conversations from "./Conversations";
import Contact from "./Contact";
import { Button, Col, Nav, Row, Tab } from "react-bootstrap";
import ContactModal from "./ContactModal";
import ConversationModal from "./ConversationModal";
import copy from "../Assets/clone-regular.svg";
import { useSelector } from "react-redux";
import showAlert from "../Functions/Alert";

const SideBar = () => {
  const chatId = useSelector((state) => state.ChatId);
  const [isContact, setIsContact] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const contacts = useSelector((state) => state.contacts);

  return (
    <>
      <Tab.Container defaultActiveKey="Conversation" justify="fade">
        <Col style={{ marginTop: "20px" }}>
          <Nav variant="pills">
            <Row style={{ width: "90%", marginLeft: "5%", marginRight: "5%" }}>
              <Col>
                <Nav.Item onClick={() => setIsContact(false)}>
                  <Nav.Link
                    style={{ textAlign: "center" }}
                    eventKey="Conversation"
                  >
                    Conversations
                  </Nav.Link>
                  <Conversations isOpen={true} />
                </Nav.Item>
              </Col>
              <Col>
                <Nav.Item onClick={() => setIsContact(true)}>
                  <Nav.Link style={{ textAlign: "center" }} eventKey="Contact">
                    Contacts
                  </Nav.Link>
                  <Contact chatId={chatId} />
                </Nav.Item>
              </Col>
            </Row>
          </Nav>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "3rem 0 1.5rem 0",
              flexWrap: "wrap"
            }}
          >
            your's chat id : {chatId}
            <img src={copy} alt="" width="16px" style={{ marginLeft: "10px", cursor: "pointer" }} onClick={() => {
              navigator.clipboard.writeText(chatId);
              showAlert({title:"Your ID has been copied to the clipboard", icon:"success"});
            }
            } />
          </div>
          <Button
            variant="primary"
            onClick={() => {
              setOpenModal(true);
            }}
            disabled={!contacts.length && !isContact}
          >
            New {isContact ? "Contact" : "Conversation"}
          </Button>
          {openModal ? (
            <>
              {isContact ? (
                <ContactModal show={openModal} setShow={setOpenModal} />
              ) : (
                <ConversationModal show={openModal} setShow={setOpenModal} />
              )}
            </>
          ) : null}
        </Col>
      </Tab.Container>
    </>
  );
};

export default SideBar;
