import { useEffect, useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import eye1 from "../Assets/eye-regular.svg";
import eye2 from "../Assets/eye-slash-regular.svg";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { Link, useNavigate } from "react-router-dom";
import showAlert from "../Functions/Alert";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "../Redux/Actions";
import showPrompt from "../Functions/Prompt";
import imageCompression from 'browser-image-compression';


const SignUp = (props) => {
  const dispatch = useDispatch();
  const { edit } = props;
  const animatedComponents = makeAnimated();
  const [passShow, setPassShow] = useState(false);
  const token = useSelector((state) => state.Token);
  const baseURI = process.env.REACT_APP_BASE_URI_BACKEND;
  const [info, setInfo] = useState({
    name: "",
    email: "",
    password: "",
    tags: [],
    upiId: "",
    dp: "",
  });
  useEffect(() => {
    if (edit) {
      getuser();
    }
  }, [edit]);
  const getuser = async () => {
    const data = await fetch(`${baseURI}/api/v1/auth/getuser`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-header": token,
      },
    });
    const user = await data.json();
    if (data.status === 200) {
      setInfo({
        name: user.name,
        email: user.email,
        tags: user.interestedTopics,
        upiId: user.UPIid,
        dp: "",
      });
    }
    else if (user.error && (user.error === "Enter the token" || user.error === "Please authenticate using a valid token")) {
      navigate("/login");
    }
    else {
      showAlert({
        title: user.error ? user.error : user ? user : "Internal server error",
        icon: "error",
      });
    }
  };
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
    try {
      if (!file) {
        return;
      }
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
    } catch (error) {
      console.log(error);
    }
  };

  const HandleImage = async (e) => {
    try {
      const file = e.target.files[0];
      const options = {
        maxSizeMB: 0.4,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      const base64 = await ConvertToBase64(compressedFile);
      const res = base64.split(",")[1];
      setInfo({ ...info, dp: res });
    } catch (error) {
      console.log(error);
    }
  };

  const getTags = async () => {
    const response = await fetch(
      `${baseURI}/api/v1/tags/getAllTags`,
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
    const response = await fetch(`${baseURI}/api/v1/tags/addTag`, {
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
    const res = await fetch(`${baseURI}/api/v1/auth/createuser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        {
          name: info.name,
          email: info.email,
          password: info.password,
          dp: info.dp,
          UPIid: info.upiId,
          interestedTopics: info.tags
        }
      )
    });
    const data = await res.json();
    if (res.status === 200) {
      dispatch(setToken(data.auto_token));
      showAlert({
        title: "User created successfully",
        icon: "success",
      });

      navigate("/questions");
      setInfo({
        name: "",
        email: "",
        password: "",
        tags: [],
        upiId: "",
        dp: "",
      });
     
    } else {
      showAlert({
        title: data.error ? data.error : data ? data : "Something went wrong",
        icon: "error",
      });
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (info.tags.length === 0) {
      setInfo({ ...info, tags: ["General"] });
    }

    const res = await fetch(`${baseURI}/api/v1/auth/updateuser`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-header": token,
      },
      body: JSON.stringify(
        {
          name: info.name,
          email: info.email,
          dp: info.dp,
          UPIid: info.upiId,
          interestedTopics: info.tags
        }
      )
    });
    const data = await res.json();
    if (res.status === 200) {
      showAlert({
        title: "User updated successfully",
        icon: "success",
      });
      navigate("/questions");
    }
    else if (data.error && (data.error === "Enter the token" || data.error === "Please authenticate using a valid token")) {
      navigate("/login");
    }
    else {
      showAlert({
        title: data.error ? data.error : data ? data : "Something went wrong",
        icon: "error",
      });
    }
  }

  useEffect(() => {
    getTags();
  }, []);

  return (
    <div
      style={{
        width: "80%",
        maxWidth: "700px",
        margin: "0 auto",
        padding: "1rem",
        marginTop: '1rem'
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
              value={info.name}
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
              value={info.email}
            />
          </Col>
        </Form.Group>

        {edit ? null : <Form.Group
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
              value={info.password}
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
        </Form.Group>}

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
              onChange={async (e) => {
                if (e.length > 0 && e[e.length - 1].value === "Add a new tag") {
                  let newtag = await showPrompt({ title: "Enter your tag" });
                  if (newtag === null || newtag === "" || newtag.trim() === "") {
                    showAlert({
                      title: "Tag can't be empty",
                      icon: "error",
                    });
                    e = e.slice(0, e.length - 1);
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
              value={info.upiId}
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
      {edit ? <Button variant="primary" type="submit" style={{ width: "100%", margin: "0 auto", fontSize: "25px", marginBottom: "1rem" }} onClick={(e) => handleEdit(e)}>Update</Button> : <>
        <Button
          variant="primary"
          type="submit"
          style={{ width: "100%", marginBottom: "1rem" }}
          onClick={(e) => HandleSubmit(e)}
        >
          Sign up Now
        </Button>
        <div>Already have an account? <Link to="/login">Login</Link></div>
      </>}
    </div>
  );
};

export default SignUp;
