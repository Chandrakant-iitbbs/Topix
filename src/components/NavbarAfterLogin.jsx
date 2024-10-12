import { Navbar, Nav, Button, Image, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logo from "../Assets/TopixLogo.png"
import { useEffect, useState } from "react";
import { deletetoken, setPersonalObjectId } from "../Redux/Actions";
import { useDispatch, useSelector } from "react-redux";

const NavbarAfterLogin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [search, setSearch] = useState("");
    const token = useSelector((state) => state.Token);

    const handleSearch = (e) => {
      e.preventDefault();
      console.log(search);
      setSearch("");
    };
  
    const handleLogOut = (e) => {
      e.preventDefault();
      dispatch(deletetoken());
      navigate("/about");
    };
  
    const [dp, setDp] = useState("");
    const [name, setName] = useState("A");
    let data = {};
  
    const getuser = async () => {
      if(token===null){
        return;
      }
      const res = await fetch("http://localhost:5000/api/v1/auth/getuser", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-header": token,
        },
      });
      if (res.status === 200) {
        data = await res.json();
        dispatch(setPersonalObjectId(data._id));
        if (data && data.name) {
          setName((data.name[0]).toUpperCase());
        }
        if (data.dp) {
          setDp(data.dp);
        }
      }
    };
  
    useEffect(() => {
      getuser();
    }, [data]);
  
    useEffect(() => {
      getuser();
    }, [token]);

  return (
    <div style={{
        width: "100%", padding: "16px"
      }}>
    <Navbar
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
            style={{ marginLeft: "10px", marginRight: "10px", width: "40px", height: "32px", marginTop: "-5px" }}
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
            <Form className="d-flex" onSubmit={(e) => {
              e.preventDefault();
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

          <Col sm={2} style={{ minWidth: "150px", cursor: "pointer", alignItems: "center", display: "flex", paddingLeft: 0, justifyContent: "center" }} >
            {dp ? (
              <Image
                src={`data:image/jpeg;base64,${dp}`}
                roundedCircle
                width={35}
                height={35}
                style={{ marginLeft: "10px", marginRight: "10px", display: "flex" }}
                onClick={(e) => {
                    e.preventDefault();
                    navigate("/user");
                  }}
              />
            ) : (
              <span
                style={{
                  marginLeft: "5px",
                  marginRight: "5px",
                  fontSize: "2rem",
                  fontWeight: "bold",
                }}
                onClick={(e) => {
                    e.preventDefault();
                    navigate("/user");
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
}

export default NavbarAfterLogin;
