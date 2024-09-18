import { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import eye1 from "../Assets/eye-regular.svg";
import eye2 from "../Assets/eye-slash-regular.svg";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";

const Login = () => {
  const [info, setInfo] = useState({ email: "", password: "" });
  const [passShow, setPassShow] = useState(false);
  const navigate = useNavigate();

  const HandleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(info),
    });
    if (res.status === 200) {
      const data = await res.json();
      localStorage.setItem("auth-token", data.auto_token);
      navigate("/questions");
    } else {
      const data = await res.json();
      swal({ icon: "error", title: data.error });
    }
  };
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
            <Form.Control
              type="email"
              placeholder="Enter your email id"
              onChange={(e) => setInfo({ ...info, email: e.target.value })}
            />
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
      </Form>
      <Button
        variant="primary"
        type="submit"
        style={{ width: "100%", marginBottom: "1rem" }}
        onClick={(e) => HandleSubmit(e)}
      >
        Login Now
      </Button>
      Don't have an account? <Link to="/signup">Sign Up</Link>
    </div>
  );
};

export default Login;
