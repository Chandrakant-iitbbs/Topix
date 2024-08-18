import { useState } from "react";
import Conversations from "./Conversations";
import Contact from "./Contact";
import { Button, Col, Nav, Row, Tab } from "react-bootstrap";
import ContactModal from "./ContactModal";
import ConversationModal from "./ConversationModal";
import copy from "../Assets/clone-regular.svg";

const SideBar = ({id}) => {
  
  const [isContact, setIsContact] = useState(false);
  const [openModal, setOpenModal] = useState(false);

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
                  <Contact id={id} />
                </Nav.Item>
              </Col>
            </Row>
          </Nav>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
              flexWrap:"wrap"
            }}
          >
            your id : {id}
            <img src={copy} alt="" width="16px" style={{marginLeft:"10px", cursor:"pointer"}} onClick={()=>navigator.clipboard.writeText(id)}/>
          </div>
          <Button
            variant="primary"
            onClick={() => {
              setOpenModal(true);
            }}
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
