import React, { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import eye1 from "../Assets/eye-regular.svg";
import eye2 from "../Assets/eye-slash-regular.svg";
import { Link } from "react-router-dom";

const Login = () => {
  const HandleSubmit = (info) => {
    console.log(info);
  }
  const [passShow, setPassShow] = useState(false);
  const [info, setInfo] = useState({ email: "", password: "" });
  return (
    <div
      style={{
        width: "80%",
        maxWidth: "700px",
        margin: "auto",
        marginTop: "6rem",
        padding: "1rem",
      }}
    >
      <Form style={{ marginBottom: "2rem" }}>
        <Form.Group
          as={Row}
          controlId="formPlaintextEmail"
          style={{ marginBottom: "1rem" }}
        >
          <Form.Label column sm="2">
            Email
          </Form.Label>
          <Col sm="10">
            <Form.Control type="email" placeholder="Enter your email id" onChange={(e)=>setInfo({...info,email:e.target.value})}/>
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="formPlaintextPassword">
          <Form.Label column sm="2">
            Password
          </Form.Label>
          <Col sm="10">
            <Form.Control
              type={passShow ? "text" : "password"}
              placeholder="Enter your password"
              onChange={(e)=>setInfo({...info,password:e.target.value})}
            />
            <img
              src={passShow ? eye2 : eye1}
              alt="eye"
              style={{
                position: "absolute",
                right: "22px",
                top: "8px",
                width: "26px",
              }}
              onClick={() => setPassShow(!passShow)}
            />
          </Col>
        </Form.Group>
      </Form>
      <Button
        variant="primary"
        type="submit"
        style={{ width: "100%", marginBottom: "1rem" }}
        onClick={()=>HandleSubmit(info)}
      >
        Login Now
      </Button>
      Don't have an account? <Link to="/signup">Sign Up</Link>
    </div>
  );
};

export default Login;
