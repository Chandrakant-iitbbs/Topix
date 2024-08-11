import React, { useState } from "react";
import { Button, Col, Nav, Row, Tab } from "react-bootstrap";

const SideBar = (props) => {
  const { id } = props;
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
                  All Conversations...
                </Nav.Item>
              </Col>
              <Col>
                <Nav.Item onClick={() => setIsContact(true)}>
                  <Nav.Link style={{ textAlign: "center" }} eventKey="Contact">
                    Contacts
                  </Nav.Link>
                  All Contacts...
                </Nav.Item>
              </Col>
            </Row>
          </Nav>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            your id : {id}
          </div>
          <Button variant="primary"
            onClick={() => {
              setOpenModal(true);
            }}
           
          >
            New {isContact ? "Contact" : "Conversation"}
          </Button>
          {openModal ? (
            <>
              {isContact ? 
                "Contact modal"
              : 
                "Conversation modal"
              }
            </>
          ) : null}
        </Col>
      </Tab.Container>
    </>
  );
};

export default SideBar;
