import { Navbar, Button, Image, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logo from "../Assets/TopixLogo.png";

const NavBarBeforeLogin = () => {
  const navigate = useNavigate();
  return (
    <div style={{
      width: "100%", padding: "16px"
    }}>
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
              onClick={(e) => {
                e.preventDefault();
                navigate("/login")
              }}
            >
              Login
            </Button>
            <Button
              variant="primary"
              style={{ height: "40px", margin: "auto" }}
              onClick={(e) => {
                e.preventDefault();
                navigate("/signup")
              }}
            >
              Sign up
            </Button>
          </Col>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default NavBarBeforeLogin;
