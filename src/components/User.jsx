import { useEffect, useState } from "react";
import { Button, Row, Col, Image, Card } from "react-bootstrap";
import HtmlToText from "./HtmlToText";
import { useNavigate } from "react-router-dom";
import { deletetoken, setQuesId, setToken } from "../Redux/Actions";
import { useDispatch, useSelector } from "react-redux";
import showAlert from "../Functions/Alert";
import { getMembershipTime, getTimeDifference, getTimeDiff } from "../Functions/GetTime";
import { getStars } from "../Functions/GetStars";
import copy from "../Assets/clone-regular.svg";
import Pagination from "./Pagination";

const User = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [ques, setQues] = useState([]);
  const [answered, setAnswered] = useState([]);
  const [user, setUser] = useState([]);
  const [likes, setLikes] = useState(0);
  const token = useSelector((state) => state.Token);

  const [pageIdQues, setPageIdQues] = useState(0);
  const [totalPagesQues, setTotalPagesQues] = useState([]);
  const [pageIdAns, setPageIdAns] = useState(0);
  const [totalPagesAns, setTotalPagesAns] = useState([]);
  const pageSize = 5;
  const [fullAns, setFullAns] = useState([]);


  useEffect(() => {
    setAnswered(fullAns.slice(pageIdAns * pageSize, (pageIdAns + 1) * pageSize));
  }, [pageIdAns]);

  useEffect(() => {
    getLengthQuestions();
  }, []);



  const getLengthQuestions = async () => {
    const data = await fetch("http://localhost:5000/api/v1/ques/getTotalQuestionsLength", {
      headers: {
        "Content-Type": "application/json",
        "auth-header": token,
      },
    });
    const res = await data.json();
    if (data.status === 200) {
      let arr = [];
      for (let i = 0; i < Math.ceil(res / pageSize); i++) {
        arr.push(i);
      }
      setTotalPagesQues(arr);

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
      `http://localhost:5000/api/v1/ques/getAllQuestionsOfUser/${pageIdQues}/${pageSize}`,
      {
        headers: {
          "Content-Type": "application/json",
          "auth-header": token,
        },
      }
    );
    const res = await data.json();
    if (data.status === 200) {
      setQues(res);
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
        `http://localhost:5000/api/v1/ques/getQuestion/${id}`,
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
      `http://localhost:5000/api/v1/answer/getAllAnswers`,
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
      for (let answer of uniqueAnswers) {
        const id = answer.question;
        const question = await fetchQuestionById(id);
        if (question) {
          answer.question = {
            id: id,
            html: question,
          };
        }
      }
      setFullAns(uniqueAnswers);
      const totalPages = Math.ceil(uniqueAnswers.length / pageSize);
      for (let i = 0; i < totalPages; i++) {
        setTotalPagesAns((prev) => [...prev, i]);
      }
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

  const getUser = async () => {
    const data = await fetch("http://localhost:5000/api/v1/auth/getuser", {
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
        user.questionsAsked !== ques.length ||
        user.questionsAnswered !== ques.length) &&
      user._id
    ) {
      const res = await fetch(
        `http://localhost:5000/api/v1/auth/updateuserbyid/${user._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "auth-header": token,
          },
          body: JSON.stringify({
            totalLikes: likes,
            questionsAnswered: answered.length,
            questionsAsked: ques.length,
          }),
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

  const intervalId = setInterval(() => {
    getUser();
    return () => clearInterval(intervalId);
  }, 60000);

  const handleEdit = (e) => {
    e.preventDefault();
    navigate("/user/editProfile");
  };

  const handleDelete = async () => {
    const data = await fetch("http://localhost:5000/api/v1/auth/deleteuser", {
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

  const handleQuestionClick = (id) => {
    dispatch(setQuesId(id));
    navigate(`/question/${id}`);
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
              src={`data:image/jpeg;base64,${user.dp}`}
              roundedCircle
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
          <div>Rating : {getStars(answered.length, likes, ques.length)}</div>
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
          {ques && ques.length} questions and answered{" "}
          {answered && answered.length} questions, you recived {likes} likes.
        </div>
      </Row>
      <Row style={{ margin: "2rem 0" }}>
        <Col>
          <h3>Question Asked</h3>
          {ques.length === 0
            ? "No question asked"
            : <> {ques.map((question, index) => (
              <Card
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                key={index}
              >
                <Card.Body>
                  <Card.Title style={{ cursor: "pointer" }} onClick={() => handleQuestionClick(question._id)}>
                    {
                      <HtmlToText
                        html={question.question}
                        index={question._id}
                        isfull={false}
                      />
                    }
                  </Card.Title>
                  <Card.Text>
                    <div style={{
                      display: "flex", justifyContent: "space-between", flexWrap: "wrap",
                      gap: "10px"
                    }}>
                      <div style={{ margin: "10px", marginLeft: 0 }}>{question.views.length} views
                      </div>
                      <div style={{ margin: "10px" }}>{getTimeDifference(question.date)}</div>
                    </div>
                  </Card.Text>
                </Card.Body>
              </Card>
            ))}
             <Pagination totalPages={totalPagesQues} pageId={pageIdQues} setPageId={setPageIdQues} />
            </>
          }
        </Col>
      </Row>
      <Row style={{ margin: "2rem 0" }}>
        <Col>
          <h3>Answered Questions</h3>
          <div>
            {answered.length === 0
              ? "No answer given from you"
              : <> {answered.map((answer, index) => (
                <Card
                  key={index}
                  style={{
                    width: "100%",
                    marginTop: "1rem"
                  }}
                >
                  <Card.Body>
                    <Card.Title style={{ cursor: "pointer" }} onClick={() => handleQuestionClick(answer.question.id)}>
                      {
                        <HtmlToText
                          html={answer.question.html}
                          index={answer._id}
                          isfull={false}
                        />
                      }
                    </Card.Title>
                    <Card.Text>
                      <div style={{
                        display: "flex", justifyContent: "space-between", flexWrap: "wrap",
                        gap: "10px"
                      }}>
                        <div style={{ margin: "10px", marginLeft: 0 }}>{answer.upVotes.length - answer.downVotes.length} likes received</div>
                        {user.BestAnswers && user.BestAnswers.includes(answer._id) ? <div style={{ margin: "10px" }}>Best Answer</div> : null}
                        <div style={{ margin: "10px" }}>{getTimeDifference(answer.date)}</div>
                      </div>
                    </Card.Text>
                  </Card.Body>
                </Card>
              ))}
               <Pagination totalPages={totalPagesAns} pageId={pageIdAns} setPageId={setPageIdAns} />
              </>}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default User;
