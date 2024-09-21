import { useEffect, useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import eye1 from "../Assets/eye-regular.svg";
import eye2 from "../Assets/eye-slash-regular.svg";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";

const SignUp = (props) => {
  const { setToken } = props;
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
  const [allTags, setAllTags] = useState([
    "Add a new tag",
    "General",
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
  ]);
  const navigate = useNavigate();

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

  const getTags = async () => {
    const response = await fetch(
      "http://localhost:5000/api/v1/tags/getAllTags",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      const data = await response.json();
      setAllTags(data[0].tags);
    }
  };

  const addTag = async (tag) => {
    const response = await fetch("http://localhost:5000/api/v1/tags/addTag", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tag }),
    });
    if (response.status === 200) {
      const data = await response.json();
      setAllTags(data.tags);
    }
  };

  const HandleSubmit = async (e) => {
    e.preventDefault();
    if (info.tags.length === 0) {
      setInfo({ ...info, tags: ["General"] });
    }
    const res = await fetch("http://localhost:5000/api/v1/auth/createuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        {
          name:info.name,
          email: info.email,
          password: info.password,
          dp:info.password, 
          UPIid:info.upiId,
          interestedTopics:info.tags
        }
      )
    });
    if (res.status === 200) {
      const data = await res.json();
      localStorage.setItem("auth-token", data.auto_token);
      setToken(data.auto_token);
      navigate("/questions");
      setInfo({
        name: "",
        email: "",
        password: "",
        tags: [],
        upiId: "",
        dp: "",
      });
    } else if (res.status === 400) {
      const data = await res.json();
      swal({ icon: "error", title: data.error });
    } else {
      swal({ icon: "error", title: "Internal server error" });
    }
  };

  useEffect(() => {
    getTags();
  }, []);

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
              value={info.tags.map((item) => ({ value: item, label: item }))}
              components={animatedComponents}
              closeMenuOnSelect={false}
              options={allTags.map((topic) => ({
                value: topic,
                label: topic,
              }))}
              isMulti
              onChange={(e) => {
                if (e.length > 0 && e[e.length - 1].value === "Add a new tag") {
                  let newtag = prompt("Enter your tag");
                  if (newtag === null) {
                    swal({
                      icon: "error",
                      title: "Tag can't be empty",
                    });
                  } else {
                    newtag = newtag && newtag.trim();
                    e[e.length - 1].value = newtag;
                    e[e.length - 1].label = newtag;
                    if (newtag) {
                      addTag(newtag);
                    }
                  }
                }
                setInfo({ ...info, tags: e.map((item) => item.value) });
              }}
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
              placeholder="Enter your UPI id"
              onChange={(e) => 
                setInfo({ ...info, upiId: e.target.value })
              }
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
        onClick={(e) => HandleSubmit(e)}
      >
        Sign up Now
      </Button>
      Already have an account? <Link to="/login">Login</Link>
    </div>
  );
};

export default SignUp;
