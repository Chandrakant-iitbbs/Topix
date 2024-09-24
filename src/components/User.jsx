import React, { useEffect, useState } from "react";
import { Button, Row, Col, Image, Card } from "react-bootstrap";
import HtmlToText from "./HtmlToText";
import swal from "sweetalert";
import {useNavigate } from "react-router-dom";
import { setQuesId } from "../Redux/Actions";
import { useDispatch, useSelector } from "react-redux";

const User = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isOnline = useSelector((state) => state.IsOnline);
  const [ques, setQues] = useState([]);
  const [answered, setAnswered] = useState([]);
  const [user, setUser] = useState([]);
  const [likes, setLikes] = useState(0);

  const getStar = () => {
    let n = 1+ 1.7*(answered.length/(10+answered.length))+ 1.3*(likes/(50+likes))+ (ques.length/(20+ques.length));
    n = Math.round(n);
    let stars = "";
    for (let i = 0; i < n; i++) {
      stars += "⭐";
    }
    return stars;
  };

  const getQues = async () => {
    const data = await fetch(
      "http://localhost:5000/api/v1/ques/getAllQuestionsOfUser",
      {
        headers: {
          "Content-Type": "application/json",
          "auth-header": localStorage.getItem("auth-token") || "",
        },
      }
    );
    const res = await data.json();
    if (data.status === 200) {
      setQues(res);
    }
    else {
      swal({
        title:  res.error ? res.error : (res?res:"Something went wrong"),
        icon: "error",
      });
    }
  };

  const removeDuplicateAnswers = (res) => {
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
            "auth-header": localStorage.getItem("auth-token") || "",
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
      "http://localhost:5000/api/v1/answer/getAllAnswers",
      {
        headers: {
          "Content-Type": "application/json",
          "auth-header": localStorage.getItem("auth-token") || "",
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
      setAnswered(uniqueAnswers);
    } else {
      swal({
        title: res.error ? res.error : (res?res:"Something went wrong"),
        icon: "error",
      });
    }
  };

  const getUser = async () => {
    const data = await fetch("http://localhost:5000/api/v1/auth/getuser", {
      headers: {
        "Content-Type": "application/json",
        "auth-header": localStorage.getItem("auth-token") || "",
      },
    });
    const res = await data.json();
    if (data.status === 200) {
      setUser(res);
    } else {
      swal({
        title: res.error ? res.error : (res?res:"Something went wrong"),
        icon: "error",
      });
    }
  };

  const updateUser = async() => {
    if((user.likes !== likes || user.questionsAsked !== ques.length || user.questionsAnswered!==ques.length) && user._id){      
      const res = await fetch(`http://localhost:5000/api/v1/auth/updateuserbyid/${user._id}`,{
        method:"PUT",
        headers:
        {
          "Content-Type": "application/json",
          "auth-header": localStorage.getItem("auth-token") || ""
        },
        body:
          JSON.stringify({ 
            totalLikes:likes,
            questionsAnswered:answered.length,
            questionsAsked:ques.length
           })
      });
      const data =await res.json();
      if(res.status===200){
        setUser(data);
      }
    }
  }

  const GetData = async () => {
    await Promise.all([getUser(), getQues(), getAns()]);
    await updateUser();
  }
  useEffect(() => {
    GetData();
  }, []);

  const handleEdit = () => {
    console.log("Edit");
  };

  const handleDelete = () => {
    console.log("Delete");
  };
  const handleChat = () => {
    console.log("Chat");
  };
  const handlePayment = () => {
    console.log("Payment");
  };

  const handleQuestionClick = (id) => {
    dispatch(setQuesId(id));
    navigate(`/question/${id}`);
  };

  const getMembershipTime = (date) => {
    const currentDate = new Date();
    const membershipDate = new Date(date);
    let diffTime = Math.abs(currentDate - membershipDate);
    const yrs = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
    diffTime -= yrs * (1000 * 60 * 60 * 24 * 365);
    const months = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30));
    diffTime -= months * (1000 * 60 * 60 * 24 * 30);
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    let membership = "";
    if (yrs > 0) {
      membership += `${yrs} years `;
    }
    if (months > 0) {
      membership += `${months} months `;
    }
    if (days > 0) {
      membership += `${days} days `;
    }
    return membership;
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
            height: "200px",
            justifyContent: "center",
            margin: "10px",
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
                borderRadius: "50%",
              }}
            >
              {user.name && user.name[0]}
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
          <div>Rating : {getStar()}</div>
          <div>{user.email}</div>
          <div>{user.interestedTopics && user.interestedTopics.join(", ")}</div>
          <div>{user.UPIid}</div>
          <div>{isOnline ? "Online" : "Offline"}</div>
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
        <Button
          variant="primary"
          onClick={handlePayment}
          style={{ margin: "10px" }}
        >
          Pay
        </Button>
        <Button
          variant="primary"
          onClick={handleChat}
          style={{ margin: "10px" }}
        >
          Chat
        </Button>
      </Row>
      <Row style={{ margin: "2rem 0" }}>
        <Col>
          <h3>Question Asked</h3>
          {ques.length === 0
            ? "No question asked"
            : ques.map((question, index) => (
              <Card
                style={{
                  width: "100%",
                  marginTop: "1rem",
                  cursor: "pointer",
                }}
                key={index}
                onClick={() => handleQuestionClick(question._id)}
              >
                <Card.Body>
                  <Card.Title>
                    {
                      <HtmlToText
                        html={question.question}
                        index={question._id}
                        isfull={false}
                      />
                    }
                  </Card.Title>
                </Card.Body>
              </Card>
            ))}
        </Col>
      </Row>
      <Row style={{ margin: "2rem 0" }}>
        <Col>
          <h3>Answered Questions</h3>
          <div>
            {answered.length === 0
              ? "No answer given from you"
              : answered.map((answer, index) => (
                <Card
                  key={index}
                  style={{
                    width: "100%",
                    marginTop: "1rem",
                    cursor: "pointer",
                  }}
                  onClick={() => handleQuestionClick(answer.question.id)}
                >
                  <Card.Body>
                    <Card.Title>
                      {
                        <HtmlToText
                          html={answer.question.html}
                          index={answer._id}
                          isfull={false}
                        />
                      }
                    </Card.Title>
                  </Card.Body>
                </Card>
              ))}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default User;
