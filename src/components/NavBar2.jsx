import React from "react";
import { Navbar, Nav, Button, Form, Col, Image } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logo from "../logo.svg";

const NavBar2 = () => {
  const navigate = useNavigate();

  return (
    <Navbar
      collapseOnSelect
      expand="sm"
      className="bg-body-tertiary"
      style={{ justifyItems: "center" }}
    >
      <Col sm={2} style={{ minWidth: "200px" }}>
        <Image
          src={logo}
          alt="logo"
          width="50"
          height="50"
          onClick={() => navigate("/")}
        />
        <Link
          to="/"
          style={{
            color: "black",
            fontSize: "30px",
            cursor: "pointer",
            textDecoration: "none",
          }}
        >
          Topix
        </Link>
      </Col>
      <Navbar.Collapse
        id="responsive-navbar-nav"
        style={{ width: "100%", display: "flex", justifyContent: "end" }}
      >
        <Col
          sm={3}
          style={{
            minWidth: "250px",
            marginRight: "10px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant="primary"
            style={{ height: "40px", margin: "auto" }}
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
          <Button
            variant="primary"
            style={{ height: "40px", margin: "auto" }}
            onClick={() => navigate("/signup")}
          >
            Sign up
          </Button>
        </Col>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar2;
