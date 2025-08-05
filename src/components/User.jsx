import { useEffect, useState } from "react";
import { Button, Row, Col, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { deletetoken } from "../Redux/Actions";
import { useDispatch, useSelector } from "react-redux";
import showAlert from "../Functions/Alert";
import { getMembershipTime, getTimeDiff } from "../Functions/GetTime";
import { getStars } from "../Functions/GetStars";
import copy from "../Assets/clone-regular.svg";
import Pagination from "./Pagination";
import QuesCardProfile from "./QuescardProfile";
import AnsCard from "./AnsCard";

const User = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [quesLength, setQuesLength] = useState(0);
  const [user, setUser] = useState([]);
  const [likes, setLikes] = useState(0);
  const token = useSelector((state) => state.Token);
  const baseURI = process.env.REACT_APP_BASE_URI_BACKEND;
  const [pageIdQues, setPageIdQues] = useState(0);
  const [pageIdAns, setPageIdAns] = useState(0);
  const pageSize = 2;
  const [fullAns, setFullAns] = useState([]);
  const [currAns, setCurrAns] = useState([]);
  const [currQues, setCurrQues] = useState([]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      getUser();
    }, 30000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    getLengthQuestions();
  }, []);

  const getLengthQuestions = async () => {
    const data = await fetch(`${baseURI}/api/v1/ques/getTotalQuestionsLength`, {
      headers: {
        "Content-Type": "application/json",
        "auth-header": token,
      },
    });
    const res = await data.json();
    if (data.status === 200) {
      setQuesLength(res);
    } else if (res.error && (res.error === "Enter the token" ||
      res.error === "Please authenticate using a valid token"
    )) {
      navigate("/login");
    } else {
      showAlert({
        title: res.error ? res.error : res ? res : "Something went wrong",
        icon: "error",
      });
    }
  };

  const getQues = async () => {
    const data = await fetch(
      `${baseURI}/api/v1/ques/getAllQuestionsOfUser/${pageIdQues}/${pageSize}`,
      {
        headers: {
          "Content-Type": "application/json",
          "auth-header": token,
        },
      }
    );
    const res = await data.json();
    if (data.status === 200) {
      setCurrQues(res);
    } else if (res.error && (res.error === "Enter the token" ||
      res.error === "Please authenticate using a valid token"
    )) {
      navigate("/login");
    } else {
      showAlert({
        title: res.error ? res.error : res ? res : "Something went wrong",
        icon: "error",
      });
    }
  };

  const removeDuplicateAnswers = (res) => {
    res.reverse();
    const newData = {};
    res.forEach((answer) => {
      if (!newData[answer.question]) {
        newData[answer.question] = answer;
      }
    });
    return Object.values(newData);
  };

  const fetchQuestionById = async (id) => {
    try {
      const response = await fetch(
        `${baseURI}/api/v1/ques/getQuestion/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            "auth-header": token,
          },
        }
      );
      const res = await response.json();
      if (response.status === 200) {
        return res.question;
      } else {
        throw new Error(`Failed to fetch question with ID: ${id}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getLikes = (res) => {
    let likes = 0;
    res.forEach((ans) => {
      let like = ans.upVotes.length - ans.downVotes.length;
      likes = likes + like;
    });
    return likes;
  };

  const getAns = async () => {
    const data = await fetch(
      `${baseURI}/api/v1/answer/getAllAnswers`,
      {
        headers: {
          "Content-Type": "application/json",
          "auth-header": token,
        },
      }
    );
    const res = await data.json();
    if (data.status === 200) {
      const totalLikes = getLikes(res);
      setLikes(totalLikes);
      const uniqueAnswers = removeDuplicateAnswers(res);

      const uniqueAnswersWithQuestions = await Promise.all(
        uniqueAnswers.map(async (answer) => {
          const id = answer.question;
          const questionHtml = await fetchQuestionById(id);
          return {
            ...answer,
            question: {
              id,
              html: questionHtml,
            },
          };
        })
      );
      setFullAns(uniqueAnswersWithQuestions);
      setanswers(uniqueAnswersWithQuestions);
    } else if (res.error && (res.error === "Enter the token" ||
      res.error === "Please authenticate using a valid token"
    )) {
      navigate("/login");
    } else {
      showAlert({
        title: res.error ? res.error : res ? res : "Something went wrong",
        icon: "error",
      });
    }
  };

  const setanswers = (uniqueAnswers) => {
    let paginatedAnswers = [];
    let currAnsArr = [];
    for (let i = 0; i < uniqueAnswers.length; i++) {
      currAnsArr.push(uniqueAnswers[i]);
      if (currAnsArr.length === pageSize) {
        paginatedAnswers.push(currAnsArr);
        currAnsArr = [];
      }
    }
    if (currAnsArr.length > 0) {
      paginatedAnswers.push(currAnsArr);
    }
    setCurrAns(paginatedAnswers[pageIdAns] || []);
  }

  const getUser = async () => {
    const data = await fetch(`${baseURI}/api/v1/auth/getuser`, {
      headers: {
        "Content-Type": "application/json",
        "auth-header": token,
      },
    });
    const res = await data.json();
    if (data.status === 200) {
      setUser(res);
    } else if (res.error && (res.error === "Enter the token" ||
      res.error === "Please authenticate using a valid token"
    )) {
      navigate("/login");
    } else {
      showAlert({
        title: res.error ? res.error : res ? res : "Something went wrong",
        icon: "error",
      });
    }
  };

  const updateUser = async () => {
    if (
      (user.likes !== likes ||
        user.questionsAsked !== quesLength ||
        user.questionsAnswered !== fullAns.length) &&
      user._id
    ) {
      const res = await fetch(
        `${baseURI}/api/v1/auth/updateuserbyid/${user._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "auth-header": token,
          },
          body:
            JSON.stringify({
              totalLikes: likes,
              questionsAnswered: fullAns.length,
              questionsAsked: quesLength,
            })
        }
      );
      const data = await res.json();
      if (res.status === 200) {
        setUser(data);
      }
      else if (res.error && (res.error === "Enter the token" ||
        res.error === "Please authenticate using a valid token"
      )) {
        navigate("/login");
      }
      else {
        showAlert({
          title: data.error ? data.error : data ? data : "Something went wrong",
          icon: "error",
        });
      }
    }
  };

  const GetData = async () => {
    await Promise.all([getUser(), getQues(), getAns()]);
    await updateUser();
  };
  useEffect(() => {
    GetData();
  }, []);

  useEffect(() => {
    getQues();
  }, [pageIdQues]);

  useEffect(() => {
    setanswers(fullAns);
  }, [pageIdAns]);

  const handleEdit = (e) => {
    e.preventDefault();
    navigate("/user/editProfile");
  };

  const handleDelete = async () => {
    const data = await fetch(`${baseURI}/api/v1/auth/deleteuser`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-header": token,
      },
    });
    const res = await data.json();
    if (data.status === 200) {
      showAlert({
        title: "You account deleted successfully",
        icon: "success",
      });
      dispatch(deletetoken());
      navigate("/");
    } else if (res.error && (res.error === "Enter the token" ||
      res.error === "Please authenticate using a valid token"
    )) {
      navigate("/login");
    } else {
      showAlert({
        title: res.error ? res.error : res ? res : "Something went wrong",
        icon: "error",
      });
    }
  };

  return (
    <div
      style={{
        padding: "1.5rem  1.5rem  1.5rem 3rem",
        maxWidth: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Row style={{ display: "flex", justifyContent: "space-around" }}>
        <Col
          style={{
            maxWidth: "200px",
            minWidth: "200px",
            justifyContent: "center",
            margin: "1rem",
            display: "flex",
            justifyItems: "center",
            alignItems: "center",
          }}
        >
          {user.dp ? (
            <Image
              src={user.dp}
              alt="User Profile"
              className="rounded-circle"
              width="100%"
              height="100%"
            />
          ) : (
            <div
              style={{
                width: "100px",
                height: "100px",
                backgroundColor: "cyan",
                display: "flex",
                justifyContent: "center",
                fontSize: "50px",
                alignItems: "center"
              }}
            >
              {user.name && user.name[0].toUpperCase()}
            </div>
          )}
        </Col>
        <Col
          style={{
            justifyItems: "center",
            alignContent: "center",
            margin: "1rem",
          }}
        >
          <div>{user.name}</div>
          <div>Rating : {getStars(fullAns.length, likes, quesLength)}</div>
          <div>{getTimeDiff(user.LastActive) < 60001 ? "Online" : "Offline"}</div>
          <div>{user.email}</div>
          <div>{user.interestedTopics && user.interestedTopics.join(", ")}</div>
          <div>{user.UPIid}</div>
          <div>{user.BestAnswers && user.BestAnswers.length} best Answers</div>
          <div>
            <div>Chat id: {user.ChatId}
              <img src={copy} alt="copy" width="16px" height="16px" style={{ cursor: "pointer", marginLeft: "10px", marginTop: "-2px" }} onClick={() => navigator.clipboard.writeText(user.ChatId)} />
            </div>
          </div>
        </Col>
        <Col
          style={{
            width: "20%",
            maxWidth: "200px",
            alignItems: "start",
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="primary"
            onClick={handleEdit}
            style={{ margin: "10px" }}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            style={{ margin: "10px" }}
          >
            Delete
          </Button>
        </Col>
      </Row>
      <Row
        style={{
          width: "100%",
          maxWidth: "600px",
          justifyContent: "space-around",
          margin: "1rem auto",
        }}
      >
        <div style={{ marginBottom: "1rem" }}>
          Member of {getMembershipTime(user.date)}, Till now you have asked{" "}
          {quesLength} questions and answered{" "}
          {fullAns.length} questions, you recived {likes} likes.
        </div>
      </Row>
      <Row style={{ margin: "2rem 0" }}>
        <Col>
          <h3>Question Asked</h3>
          {currQues.length === 0
            ? "No question asked"
            : <> {currQues.map((question, index) => (
              <QuesCardProfile key={index} ques={question} />
            ))}
              {(quesLength > pageSize) && <div style={{ margin: "1rem" }}>
                <Pagination pageId={pageIdQues} totalPages={Math.ceil(quesLength / pageSize)} setPageId={setPageIdQues} />
              </div>}
            </>
          }
        </Col>
      </Row>
      <Row style={{ margin: "2rem 0" }}>
        <Col>
          <h3>Answered Questions</h3>
          <div>{fullAns.length === 0
            ? "No answer given from you"
            : <>{
              currAns.map((answer, index) => (
                <AnsCard key={index} answer={answer} user={user} />
              ))}
              {(fullAns.length > pageSize) && <div style={{ margin: "1rem" }}>
                <Pagination pageId={pageIdAns} totalPages={Math.ceil(fullAns.length / pageSize)} setPageId={setPageIdAns} />
              </div>}
            </>}</div>
        </Col>
      </Row>
    </div>
  );
};

export default User;
