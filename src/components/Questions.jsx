import { useEffect, useState } from "react";
import { Dropdown, Button, Form, Col, Row } from "react-bootstrap";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import QuesCard from "./QuesCard";
import { useNavigate } from "react-router-dom";
import showAlert from "../Functions/Alert";
import { useSelector } from "react-redux";
import Pagination from "./Pagination";

const Questions = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.Token);
  const animatedComponents = makeAnimated();
  const [allTags, setAllTags] = useState([]);
  const [currQuestions, setCurrQuestions] = useState([]);
  const [pageIdQues, setPageIdQues] = useState(0);
  const [totalPagesQues, setTotalPagesQues] = useState(0);
  const [sortBy, setSortBy] = useState("time");
  const [TagsSortBy, setTagsSortBy] = useState([]);
  const pageSize = 5;
  const baseURI = process.env.REACT_APP_BASE_URI_BACKEND;

  useEffect(() => {
    if (sortBy === "time") {
      sortByTimePageChangeHandler();
    }
    else if (sortBy === "reward") {
      sortByRewardPageChangeHandler();
    }
    else if (sortBy === "tag" && TagsSortBy.length > 0) {
      sortByTagPageChangeHandler(TagsSortBy);
    }
  }, [pageIdQues, sortBy]);


  const getAllTags = async () => {
    const res = await fetch(`${baseURI}/api/v1/tags/getAllTags`, {
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

  const getTotalQuestionLength = async () => {
    const res = await fetch(`${baseURI}/api/v1/ques/getTotalQuestions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-header": token,
      },
    });

    const a = await res.json();
    if (res.status === 200) {
      setTotalPagesQues(Math.ceil(a / pageSize));
    } else if (res.error && (res.error === "Enter the token" || res.error === "Please authenticate using a valid token")) {
      navigate("/login");
    }
    else {
      showAlert({
        title: res.error ? res.error : res ? res : "Internal server error",
        icon: "error",
      });
    }
  };

  useEffect(() => {
    getAllTags();
    getTotalQuestionLength();
  }, []);

  const sortByTimePageChangeHandler = async () => {
    let url = `${baseURI}/api/v1/ques/getAllQuestions/${pageIdQues}/${pageSize}`;
    if (TagsSortBy.length > 0) {
      const tag = TagsSortBy;
      url = `${baseURI}/api/v1/ques/getAllQuestionsByTag/${tag
        }/${pageIdQues}/${pageSize}`;
    }
    const data = await fetch(
      url,
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
      setCurrQuestions(ques);
    } else if (ques.error && (ques.error === "Enter the token" || ques.error === "Please authenticate using a valid token")) {
      navigate("/login");
    } else {
      showAlert({
        title: ques.error ? ques.error : ques ? ques : "Internal server error",
        icon: "error",
      });
    }
  };

  const sortByTime = async () => {
    setPageIdQues(0);
    setSortBy("time");
    sortByTimePageChangeHandler();
    if (TagsSortBy.length > 0) {
      getLengthFromTag(TagsSortBy);
    }
    else {
      getTotalQuestionLength();
    }
  };

  const sortByRewardPageChangeHandler = async () => {
    let url = `${baseURI}/api/v1/ques/getAllQuestionsByReward/${pageIdQues}/${pageSize}`;
    if (TagsSortBy.length > 0) {
      const tag = TagsSortBy;
      url = `${baseURI}/api/v1/ques/getAllQuestionsByTagByReward/${tag}/${pageIdQues}/${pageSize}}`;
    }
    const data = await fetch(url,
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
      setCurrQuestions(ques);
    } else if (ques.error && (ques.error === "Enter the token" || ques.error === "Please authenticate using a valid token")) {
      navigate("/login");
    }
    else {
      showAlert({
        title: ques.error ? ques.error : ques ? ques : "Internal server error",
        icon: "error",
      });
    }
  }

  const sortByReward = async () => {
    setPageIdQues(0);
    setSortBy("reward");
    sortByRewardPageChangeHandler();
    if (TagsSortBy.length > 0) {
      getLengthFromTag(TagsSortBy);
    }
    else {
      getTotalQuestionLength();
    }
  };

  const sortByTagPageChangeHandler = async (t) => {
    const tag = t;
    const data = await fetch(`${baseURI}/api/v1/ques/getAllQuestionsByTag/${tag}/${pageIdQues}/${pageSize}`,
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
      setCurrQuestions(ques);
    } else if (ques.error && (ques.error === "Enter the token" || ques.error === "Please authenticate using a valid token")) {
      navigate("/login");
    } else {
      showAlert({
        title: ques.error ? ques.error : ques ? ques : "Internal server error",
        icon: "error",
      });
    }
  };

  const getLengthFromTag = async (t) => {
    const tag = t;
    const data = await fetch(`${baseURI}/api/v1/ques/getLengthFromTags/${tag}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-header": token,
      },
    });
    const length = await data.json();
    if (data.status === 200) {
      setTotalPagesQues(Math.ceil(length / pageSize));
    } else if (length.error && (length.error === "Enter the token" || length.error === "Please authenticate using a valid token")) {
      navigate("/login");
    } else {
      showAlert({
        title: length.error ? length.error : length ? length : "Internal server error",
        icon: "error",
      });
    }
  }

  const sortByTag = async (e) => {
    if (e.length === 0) {
      setTagsSortBy([]);
      sortByTime();
      getTotalQuestionLength();
      return;
    }
    setSortBy("tag");
    const tag = e.map((t) => t.value);
    setTagsSortBy(tag);
    getLengthFromTag(tag);
    setPageIdQues(0);
    sortByTagPageChangeHandler(tag);
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
          <Button onClick={(e) => {
            e.preventDefault();
            navigate("/askQues")
          }}>Ask a question</Button>
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
      {currQuestions.length > 0 ? currQuestions.map((question) => {
          return (
            <QuesCard
              key={question._id}
              ques={question}
            />
          );
        }) : (
          <div className="d-flex mt-2">
            <h3>No question found</h3>
          </div>
        )}
        {totalPagesQues > 1 && <Pagination totalPages={totalPagesQues} pageId={pageIdQues} setPageId={setPageIdQues} />}
      </div>
    </div>
  );
};

export default Questions;
