import { useEffect, useState } from "react";
import { Dropdown, Button, Form, Col, Row } from "react-bootstrap";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import QuesCard from "./QuesCard";

const Questions = () => {
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
          "auth-header":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjY5NTJkZDlhNjU0N2NmMmExMDRiNTllIn0sImlhdCI6MTcyMTI2ODAyMH0.HzFCj14g8v48JSx3zetJpccBCgP5R_4vRJV8uslWvgw",
        },
      }
    );
    const ques = await data.json();
    setQuestions(ques);
  };

  const setTags = async () => {
    const res = await fetch("http://localhost:5000/api/v1/tags/getAllTags", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-header":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjY5NTJkZDlhNjU0N2NmMmExMDRiNTllIn0sImlhdCI6MTcyMTI2ODAyMH0.HzFCj14g8v48JSx3zetJpccBCgP5R_4vRJV8uslWvgw",
      },
    });
    const tagsData = await res.json();
    setAllTags(tagsData[0].tags);
  };

  useEffect(() => {
    getQuestions();
    setTags();
  }, []);

  const sortByTime = async () => {
    const data = await fetch(
      "http://localhost:5000/api/v1/ques/getAllQuestionsByTime",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-header":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjY5NTJkZDlhNjU0N2NmMmExMDRiNTllIn0sImlhdCI6MTcyMTI2ODAyMH0.HzFCj14g8v48JSx3zetJpccBCgP5R_4vRJV8uslWvgw",
        },
      }
    );
    const ques = await data.json();
    setQuestions(ques);
  };

  const sortByReward = async () => {
    const data = await fetch(
      "http://localhost:5000/api/v1/ques/getAllQuestionsByReward",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-header":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjY5NTJkZDlhNjU0N2NmMmExMDRiNTllIn0sImlhdCI6MTcyMTI2ODAyMH0.HzFCj14g8v48JSx3zetJpccBCgP5R_4vRJV8uslWvgw",
        },
      }
    );
    const ques = await data.json();
    setQuestions(ques);
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
          "auth-header":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjY5NTJkZDlhNjU0N2NmMmExMDRiNTllIn0sImlhdCI6MTcyMTI2ODAyMH0.HzFCj14g8v48JSx3zetJpccBCgP5R_4vRJV8uslWvgw",
        },
      }
    );
    const ques = await data.json();
    setQuestions(ques);
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
              <div style={{ margin: "8px" }} onClick={sortByTime}>
                Newest
              </div>
              <div style={{ margin: "8px" }} onClick={sortByReward}>
                Highest reward
              </div>
              <div style={{ margin: "8px" }}>
                <Form.Group as={Row} controlId="tags">
                  <Col style={{ width: "20rem" }}>
                    By tags
                    <Select
                      components={animatedComponents}
                      closeMenuOnSelect={false}
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
          <Button>Ask a question</Button>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          flexDirection: "column",
          width:"90%"
        }}
      >
        {questions.map((question) => {
          return <QuesCard key={question._id} ques={question} />;
        })}
      </div>
    </div>
  );
};

export default Questions;
