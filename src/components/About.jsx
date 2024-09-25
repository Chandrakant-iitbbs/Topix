import { Button, Col, Row, Image } from "react-bootstrap";
import download from "../Assets/download.jpeg";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const About = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("auth-token")|| "";

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
            {token ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  width: "100%",
                }}
              >
                <Button
                  style={{ margin: "10px" }}
                  onClick={() => navigate("/questions")}
                >
                  Go to questions
                </Button>
                <Button
                  style={{ margin: "10px" }}
                  onClick={() => navigate("/askQues")}
                >
                  Ask a question
                </Button>
              </div>
            ) : null}
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
