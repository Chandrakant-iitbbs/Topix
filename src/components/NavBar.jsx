import { Navbar, Nav, Button, Image, Col, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logo from "../logo.svg";
import { useEffect, useState } from "react";

const NavBar = (props) => {
  const { setToken } = props;
  const [search, setSearch] = useState("");
  const handleSearch = (e) => {
    e.preventDefault();
    console.log(search);
    setSearch("");
  };

  const handleLogOut = (e) => {
    e.preventDefault();
    localStorage.removeItem("auth-token");
    setToken(null);
    navigate("/");
  };
  const navigate = useNavigate();

  const [dp, setDp] = useState("");
  const [name, setName] = useState("C");

  const getuser = async () => {
    const res = await fetch("http://localhost:5000/api/v1/auth/getuser", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-header": localStorage.getItem("auth-token") || "",
      },
    });
    if (res.status === 200) {
      const data = await res.json();
      setName((data.name[0]).toUpperCase());
      if (data.dp) {
        setDp("data:image/jpeg;base64," + data.dp);
      }
    }
  };

  useEffect(() => {
    getuser();
  }, []);

  return (

    <div style={{width:"100%", padding:"20px"
    }}>
    <Navbar
      collapseOnSelect
      expand="md"
      className="bg-body-tertiary"
      width="100%"
    >
      <Col style={{ minWidth: "160px", paddingLeft:0 }}>
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
      <Navbar.Collapse id="responsive-navbar-nav" style={{width:"80%"}}>
        <Col
          sm={4}
          style={{
            width: "100%",
            marginRight: "20px",
            justifyItems: "center",
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            flexWrap:"wrap"
          }}
        >
          <Nav className="me-auto">
            <Link
              to="/users"
              style={{
                justifyContent: "center",
                paddingLeft: "16px",
                paddingRight: "16px",
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
                paddingLeft: "16px",
                paddingRight: "16px",
                textDecoration: "none",
                display: "flex",
              }}
            >
              Questions
            </Link>
            <Link
              to="/about"
              style={{
                justifyContent: "center",
                paddingLeft: "16px",
                paddingRight: "16px",
                textDecoration: "none",
                display: "flex",
              }}
            >
              About
            </Link>
          </Nav>
        </Col>
        <Col>
          <Form className="d-flex" style={{ marginLeft: "16px" }} onSubmit={(e)=>{
            handleSearch(e);
          }}>
            <Form.Control
              type="text"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              style={{ minWidth: "100px"}}
              onChange={(e)=>setSearch(e.target.value)}
              value={search}
            />
          </Form>
        </Col>

        <Col sm={2} style={{ minWidth: "200px", cursor:"pointer", alignItems:"center", display:"flex" }} onClick={()=>navigate("/user")}>
          {dp.length ? (
            <Image
              src={dp}
              roundedCircle
              width={35}
              height={35}
              style={{ marginLeft: "16px", marginRight: "16px" }}
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
    </Navbar>
    </div>
  );
};

export default NavBar;
