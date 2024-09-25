import { useEffect, useState } from "react";
import { Dropdown, Button, Form, Col, Row } from "react-bootstrap";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import QuesCard from "./QuesCard";
import { useNavigate } from "react-router-dom";
import showAlert from "../Functions/Alert";

const Questions = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("auth-token") || "";
  const animatedComponents = makeAnimated();
  const [allTags, setAllTags] = useState([]);
  const [questions, setQuestions] = useState([]);

  const getQuestions = async () => {
    const data = await fetch(
      "http://localhost:5000/api/v1/ques/getAllQuestions",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-header": token,
        },
      }
    );
    const ques = await data.json();
    if (data.status === 200) {
      setQuestions(ques);
    } else if (ques.error === "Enter the token" || ques.error === "Please authenticate using a valid token") {
      navigate("/login");
    } else {
      showAlert({
        title: ques.error ? ques.error : ques ? ques : "Internal server error",
        icon: "error",
      });
    }
  };


  const getAllTags = async () => {
    const res = await fetch("http://localhost:5000/api/v1/tags/getAllTags", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status === 200) {
      const tagsData = await res.json();
      const tags = tagsData[0].tags.filter((tag) => tag !== "Add a new tag");
      setAllTags(tags);
    }
  };

  useEffect(() => {
    getQuestions();
    getAllTags();
  }, []);

  const sortByTime = async () => {
    const data = await fetch(
      "http://localhost:5000/api/v1/ques/getAllQuestionsByTime",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-header": token,
        },
      }
    );
    const ques = await data.json();

    if (data.status === 200) {
      setQuestions(ques);
    } else if (ques.error && (ques.error == "Enter the token" || ques.error == "Please authenticate using a valid token")) {
      navigate("/login");
    }
    else {
      showAlert({
        title: ques.error ? ques.error : ques ? ques : "Internal server error",
        icon: "error",
      });
    }
  };

  const sortByReward = async () => {
    const data = await fetch(
      "http://localhost:5000/api/v1/ques/getAllQuestionsByReward",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-header": token,
        },
      }
    );
    const ques = await data.json();
    if (data.status === 200) {
      setQuestions(ques);
    } else if (ques.error && (ques.error == "Enter the token" || ques.error == "Please authenticate using a valid token")) {
      navigate("/login");
    }
    else {
      showAlert({
        title: ques.error ? ques.error : ques ? ques : "Internal server error",
        icon: "error",
      });
    }
  };

  const sortByTag = async (e) => {
    if (e.length === 0) {
      getQuestions();
      return;
    }
    const tag = e.map((t) => t.value);
    const data = await fetch(
      `http://localhost:5000/api/v1/ques/getAllQuestionsByTag/${tag}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-header": token,
        },
      }
    );
    const ques = await data.json();
    if (data.status === 200) {
      setQuestions(ques);
    } else if (ques.error && (ques.error == "Enter the token" || ques.error == "Please authenticate using a valid token")) {
      navigate("/login");
    }
    else {
      showAlert({
        title: ques.error ? ques.error : ques ? ques : "Internal server error",
        icon: "error",
      });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        margin: "10px 10px",
        padding: "10px 10px",
      }}
    >
      <h3>Questions</h3>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "85%",
          justifyContent: "space-between",
          margin: "10px",
        }}
      >
        <div>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Sorted by
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ padding: "10px" }}>
              <Dropdown.Item onClick={sortByTime}>Latest</Dropdown.Item>
              <Dropdown.Item onClick={sortByReward}>
                Highest reward
              </Dropdown.Item>

              <div style={{ padding: "4px 24px" }}>
                <Form.Group as={Row} controlId="tags">
                  <Col style={{ width: "20rem" }}>
                    By tags
                    <Select
                      components={animatedComponents}
                      closeMenuOnSelect={true}
                      options={allTags.map((topic) => ({
                        value: topic,
                        label: topic,
                      }))}
                      isMulti
                      onChange={(e) => {
                        sortByTag(e);
                      }}
                    />
                  </Col>
                </Form.Group>
              </div>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div>
          <Button onClick={() => navigate("/askQues")}>Ask a question</Button>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          flexDirection: "column",
          width: "90%",
        }}
      >
        {questions.map((question) => {
          return (
            <QuesCard
              key={question._id}
              ques={question}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Questions;
