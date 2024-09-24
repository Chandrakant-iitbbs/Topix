import { useRef } from "react";
import { v4 } from "uuid";
import { Form, Button, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setChatId } from "../Redux/Actions";

const ChatLogin = () => {
  const dispatch = useDispatch();
  const idref = useRef(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!idref.current.value) return;
    dispatch(setChatId(idref.current.value));
  };
  const createNewId = (e) => {
    e.preventDefault();
    dispatch(setChatId(v4()));
  };
  return (
    <Form className="w-full p-4">
      <Form.Group controlId="login" className="my-4">
        <Form.Label>Enter id</Form.Label>
        <Form.Control
          ref={idref}
          type="text"
          placeholder="Enter your id here"
        />
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
          style={{ width: "20%", minWidth: "100px", justifyContent: "center" }}
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
