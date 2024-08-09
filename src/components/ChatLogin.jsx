import React, { useRef } from "react";
import { v4 } from "uuid";
import { Form, Button, Row } from "react-bootstrap";

const ChatLogin = (props) => {
  const idref = useRef("");
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(idref.current.value);
  };
  const createNewId = (e) => {
    e.preventDefault();
    console.log(v4());
  };
  return (
    <Form className="w-full p-4">
      <Form.Group controlId="login" className="my-4">
        <Form.Label>Enter id</Form.Label>
        <Form.Control type="text" placeholder="Enter your id here" />
      </Form.Group>
      <Row className="d-flex justify-content-around">
        <Button
          style={{ width: "20%", minWidth: "100px", justifyContent: "center" }}
          onClick={handleSubmit}
          className="d-flex"
        >
          Login
        </Button>
        <Button
          style={{ width: "20%", minWidth: "100px",justifyContent: "center" }}
          onClick={createNewId}
          className="d-flex"
        >
          Create new Id
        </Button>
      </Row>
    </Form>
  );
};

export default ChatLogin;
