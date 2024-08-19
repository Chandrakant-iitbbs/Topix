import React, { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import eye1 from "../Assets/eye-regular.svg";
import eye2 from "../Assets/eye-slash-regular.svg";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { Link } from "react-router-dom";

const SignUp = () => {
  const HandleSubmit = (info) => {
    console.log(info);
  };

  const ConvertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const HandleImage = async (e) => {
    const file = e.target.files[0];
    const base64 = await ConvertToBase64(file);
    const res = base64.split(",")[1];
    setInfo({ ...info, dp: res });
  };

  const animatedComponents = makeAnimated();
  const [passShow, setPassShow] = useState(false);
  const [info, setInfo] = useState({
    name: "",
    email: "",
    password: "",
    tags: [],
    upiId: "",
    dp: "",
  });
  const topics = [
    "React",
    "Angular",
    "Vue",
    "Node",
    "Express",
    "MongoDB",
    "Python",
    "Django",
    "Flask",
    "PostgreSQL",
  ];

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
        <Form.Group as={Row} controlId="name" style={{ marginBottom: "1rem" }}>
          <Form.Label column sm="2">
            Name
          </Form.Label>
          <Col sm="10">
            <Form.Control
              type="text"
              placeholder="Enter your name"
              onChange={(e) => setInfo({ ...info, name: e.target.value })}
            />
          </Col>
        </Form.Group>

        <Form.Group
          as={Row}
          controlId="formPlaintextEmail"
          style={{ marginBottom: "1rem" }}
        >
          <Form.Label column sm="2">
            Email
          </Form.Label>
          <Col sm="10">
            <Form.Control
              type="email"
              placeholder="Enter your email id"
              onChange={(e) => setInfo({ ...info, email: e.target.value })}
            />
          </Col>
        </Form.Group>

        <Form.Group
          as={Row}
          controlId="formPlaintextPassword"
          style={{ marginBottom: "1rem" }}
        >
          <Form.Label column sm="2">
            Password
          </Form.Label>
          <Col sm="10">
            <Form.Control
              type={passShow ? "text" : "password"}
              placeholder="Enter your password"
              onChange={(e) => setInfo({ ...info, password: e.target.value })}
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

        <Form.Group as={Row} controlId="tags">
          <Form.Label column sm="2" style={{ marginTop: "-10px" }}>
            Interested topics
          </Form.Label>
          <Col sm="10">
            <Select
              components={animatedComponents}
              closeMenuOnSelect={false}
              options={topics.map((topic) => ({ value: topic, label: topic }))}
              isMulti
              onChange={(e) =>
                setInfo({ ...info, tags: e.map((item) => item.value) })
              }
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="upiId" style={{ marginBottom: "1rem" }}>
          <Form.Label column sm="2">
            UPI id
          </Form.Label>
          <Col sm="10">
            <Form.Control
              type="text"
              placeholder="Enter your upi id"
              onChange={(e) => setInfo({ ...info, upiId: e.target.value })}
              accept=".jpg,.jpeg,.png"
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="Dp" style={{ marginBottom: "1rem" }}>
          <Form.Label column sm="2">
            Dp
          </Form.Label>
          <Col sm="10">
            <Form.Control type="file" onChange={(e) => HandleImage(e)} />
          </Col>
        </Form.Group>
      </Form>
      <Button
        variant="primary"
        type="submit"
        style={{ width: "100%", marginBottom: "1rem" }}
        onClick={() => HandleSubmit(info)}
      >
        Sign up Now
      </Button>
      Already have an account? <Link to="/login">Login</Link>
    </div>
  );
};

export default SignUp;
