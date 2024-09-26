import { Navbar, Nav, Button, Image, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logo from "../logo.svg";
import { useEffect, useState } from "react";

const NavBar = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const token = localStorage.getItem("auth-token") || "";
  const handleSearch = (e) => {
    e.preventDefault();
    console.log(search);
    setSearch("");
  };

  const handleLogOut = (e) => {
    e.preventDefault();
    localStorage.removeItem("auth-token");
    navigate("/")
  };

  const [dp, setDp] = useState("");
  const [name, setName] = useState("A");
  let data ={};

  const getuser = async () => {
    const res = await fetch("http://localhost:5000/api/v1/auth/getuser", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-header": token,
      },
    });
    if (res.status === 200) {
      data = await res.json();
      setName((data.name[0]).toUpperCase());
      if (data.dp) {
        setDp(data.dp);
      }
    }
  };

  useEffect(() => {
    getuser();
  }, [data]);

  return (

    <div style={{
      width: "100%", padding: "16px"
    }}>
      {token?<Navbar
        collapseOnSelect
        expand="md"
        className="bg-body-tertiary"
        width="100%"
        style={{ padding: "0px" }}
      >
      <Col style={{ minWidth: "140px", paddingLeft: 0 }}>
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
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav" >
          <Col
            sm={6}
            style={{
              width: "100%",
              justifyItems: "center",
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap"
            }}
          >
            <Nav className="me-auto">
              <Link
                to="/users"
                style={{
                  justifyContent: "center",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                  textDecoration: "none",
                  display: "flex",
                }}
              >
                Users
              </Link>
              <Link
                to="/questions"
                style={{
                  justifyContent: "center",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                  textDecoration: "none",
                  display: "flex",
                }}
              >
                Questions
              </Link>
              <Link
                to="/chatting"
                style={{
                  justifyContent: "center",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                  textDecoration: "none",
                  display: "flex",
                }}
              >
                Chat
              </Link>
              <Link
                to="/about"
                style={{
                  justifyContent: "center",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                  textDecoration: "none",
                  display: "flex",
                }}
              >
                About
              </Link>

            </Nav>
          </Col>
          <Col>
            <Form className="d-flex"  onSubmit={(e) => {
              handleSearch(e);
            }}>
              <Form.Control
                type="text"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                style={{ minWidth: "100px" }}
                onChange={(e) => setSearch(e.target.value)}
                value={search}
              />
            </Form>
          </Col>

          <Col sm={2} style={{ minWidth: "150px", cursor: "pointer", alignItems: "center", display: "flex" , paddingLeft:0, justifyContent:"center"}} onClick={() => navigate("/user")}>
            {dp ? (
              <Image
                src={`data:image/jpeg;base64,${dp}`}
                roundedCircle
                width={35}
                height={35}
                style={{ marginLeft: "10px", marginRight: "10px", display:"flex" }}
              />
            ) : (
              <span
                style={{
                  marginLeft: "5px",
                  marginRight: "5px",
                  fontSize: "2rem",
                  fontWeight: "bold",
                }}
              >
                {name}
              </span>
            )}
            <Button
              variant="primary"
              style={{ margin: "auto", width: "100px" }}
              onClick={(e) => handleLogOut(e)}
            >
              Log out
            </Button>
          </Col>
        </Navbar.Collapse>
      </Navbar>:<Navbar
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
    </Navbar>}
    </div>
  );
};

export default NavBar;
