import React from "react";
import { Button, Col, Row, Image } from "react-bootstrap";
import download from "../Assets/download.jpeg";

const About = () => {
  const handleLogin = () => {
    console.log("login");
  };

  const handleSignup = () => {
    console.log("signup");
  };

  return (
    <div style={{ margin: "2rem 4rem" }}>
      <Row
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        <Col style={{ minWidth: "300px", alignContent: "center" }}>
          <Row style={{ margin: "1rem 1rem" }}>
          Introducing Topix, the interactive platform where curiosity meets collaboration! Topix is your go-to app for asking burning questions and being part of a dynamic community that loves solving them
          </Row>
          <Row
            style={{
              margin: "1rem",
              justifyContent: "space-around",
              display: "flex",
            }}
          >
            <Button style={{ margin: "10px" }} onClick={() => handleLogin()}>
              Login
            </Button>
            <Button style={{ margin: "10px" }} onClick={() => handleSignup()}>
              Sign up
            </Button>
          </Row>
        </Col>
        <Col
          style={{
            minWidth: "300px",
            maxWidth: "500px",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <Image src={download} style={{ height: "100%", width: "100%" }} />
        </Col>
      </Row>
    </div>
  );
};

export default About;
