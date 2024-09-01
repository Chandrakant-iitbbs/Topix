import React from "react";
import {
  Navbar,
  Container,
  Nav,
  NavDropdown,
  Button,
  Image,
  Row,
  Col,
  Form,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logo from "../logo.svg";

const NavBar = () => {
  const handleSearch = () => {
    console.log("search");
  };

  const handleLogOut = ()=>{
    console.log("logout");
  }
  const navigate = useNavigate();

  return (
    <Navbar collapseOnSelect expand="md" className="bg-body-tertiary" style={{justifyItems:'center'}}>
        <Col sm={2} style={{minWidth:"200px"}} >
          <Image src={logo} alt="logo" width="50" height="50" onClick={()=>navigate("/")} />
          <Link to="/" style={{color:"black", fontSize:"30px", cursor:"pointer", textDecoration:"none"}}>Topix</Link>
        </Col>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Col sm={4} style={{width:"100%", marginRight:"20px", justifyItems:"center",alignItems:"center", display:"flex", justifyContent:"center"}}>
            <Nav className="me-auto">
              <Link to="/users" style={{justifyContent:"center", paddingLeft:"16px", paddingRight:"16px", textDecoration:"none"}}>Users</Link>
              <Link to="/questions" style={{justifyContent:"center", paddingLeft:"16px", paddingRight:"16px",textDecoration:"none"}}>Questions</Link> 
              <Link to="/about" style={{justifyContent:"center", paddingLeft:"16px", paddingRight:"16px",textDecoration:"none"}}>About</Link>            
            </Nav>
          </Col>
          <Col>
          <Form className="d-flex"style={{marginLeft:"16px"}} >
                  <Form.Control
                    type="search"
                    placeholder="Search"
                    className="me-2"
                    aria-label="Search"
                  />
                  <Button variant="success" onClick={handleSearch} style={{marginLeft:"16px", marginRight:"10px"}}>Search</Button>
                </Form>
                </Col>
         
          <Col sm={2} style={{minWidth:"200px"}}>
              <Image src="https://imgv3.fotor.com/images/slider-image/A-clear-close-up-photo-of-a-woman.jpg" roundedCircle  width={50} height={50} style={{marginLeft:"16px", marginRight:"16px"}}/>
              <Button variant="primary" style={{height:"40px", margin:"auto"}} onClick={handleLogOut}>Log out</Button>
          </Col>
        </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
