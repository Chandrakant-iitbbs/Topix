import { useEffect, useState } from "react";
import { Button, Row, Col, Image, Card } from "react-bootstrap";
import HtmlToText from "./HtmlToText";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addConversations, setQuesId } from "../Redux/Actions";
import showAlert from "../Functions/Alert";
import { getMembershipTime } from "../Functions/GetTime";
import { getStars } from "../Functions/GetStars";
import { addContact } from "../Redux/Actions";
import copy from "../Assets/clone-regular.svg";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [ques, setQues] = useState([]);
  const [answered, setAnswered] = useState([]);
  const [user, setUser] = useState([]);
  const [likes, setLikes] = useState(0);
  const contacts = useSelector((state) => state.contacts);

  const userId = useSelector((state) => state.UserId);

  const token = localStorage.getItem("auth-token") || "";

  const getQues = async () => {
    const data = await fetch(
      `http://localhost:5000/api/v1/ques/getAllQuestionsByUser/${userId}`,
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
    }
    else if (res.error && (res.error === "Enter the token" || res.error === "Please authenticate using a valid token")) {
      navigate("/login");
    }
    else {
      showAlert({
        title: res.error ? res.error : (res ? res : "Something went wrong"),
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
      `http://localhost:5000/api/v1/answer/getUserAnswers/${userId}`,
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
      setAnswered(uniqueAnswers);
    } else if (res.error && (res.error === "Enter the token" || res.error === "Please authenticate using a valid token")) {
      navigate("/login");
    }
    else {
      showAlert({
        title: res.error ? res.error : (res ? res : "Something went wrong"),
        icon: "error",
      });
    }
  };

  const getUser = async () => {
    const data = await fetch(`http://localhost:5000/api/v1/auth/getuserbyid/${userId}`, {
      headers: {
        "Content-Type": "application/json",
        "auth-header": token,
      },
    });
    const res = await data.json();
    if (data.status === 200) {
      setUser(res);
    } else if (res.error && (res.error === "Enter the token" || res.error === "Please authenticate using a valid token")) {
      navigate("/login");
    }
    else {
      showAlert({
        title: res.error ? res.error : (res ? res : "Something went wrong"),
        icon: "error",
      });
    }
  };

  const updateUser = async () => {
    if ((user.likes !== likes || user.questionsAsked !== ques.length || user.questionsAnswered !== ques.length) && user._id) {
      const res = await fetch(`http://localhost:5000/api/v1/auth/updateuserbyid/${user._id}`, {
        method: "PUT",
        headers:
        {
          "Content-Type": "application/json",
          "auth-header": token,
        },
        body:
          JSON.stringify({
            totalLikes: likes,
            questionsAnswered: answered.length,
            questionsAsked: ques.length
          })
      });
      const data = await res.json();
      if (res.status === 200) {
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

  const handleChat = () => {
    const contact = contacts.find((contact) => contact.chatId === user.ChatId);
    if (contact) {
      navigate("/chatting");
      return;
    }
    else{
      dispatch(addContact(user.ChatId, user.name));
      dispatch(addConversations([ user.ChatId], []));
      navigate("/chatting");
    }
  };
  const handlePayment = () => {
    console.log("Payment");
  };

  const handleQuestionClick = (id) => {
    dispatch(setQuesId(id));
    navigate(`/question/${id}`);
  };

  return (
    <div
      style={{
        padding: "1.5rem 3rem",
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
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div>{user.name}</div>
          <div>Rating : {getStars(answered.length, likes, ques.length)}</div>
          <div>{user.email}</div>
          <div>{user.interestedTopics && user.interestedTopics.join(", ")}</div>
          <div>{user.UPIid}</div>
          <div>Chat id: {user.ChatId} 
            <img src={copy} alt="copy" width="16px" height="16px" style={{cursor: "pointer", marginLeft:"10px", marginTop:"-2px"}} onClick={() => {
              navigator.clipboard.writeText(user.ChatId);
              showAlert({
                title: `${user.name}'s chat ID copied to clipboard`,
                icon: "success",
              });
              }} />
          </div>
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
          Member of {getMembershipTime(user.date)}, Till now {user && user.name} have asked{" "}
          {ques && ques.length} questions and answered{" "}
          {answered && answered.length} questions, and recived {likes} likes.
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

export default Profile;
