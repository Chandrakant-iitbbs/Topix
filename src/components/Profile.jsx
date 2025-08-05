import { useEffect, useState } from "react";
import { Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addConversations, SetPaymentInfo } from "../Redux/Actions";
import showAlert from "../Functions/Alert";
import { getMembershipTime, getTimeDiff } from "../Functions/GetTime";
import { getStars } from "../Functions/GetStars";
import { addContact } from "../Redux/Actions";
import copy from "../Assets/clone-regular.svg";
import Pagination from "./Pagination";
import QuesCardProfile from "./QuescardProfile";
import AnsCard from "./AnsCard";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [quesLength, setQuesLength] = useState(0);
  const [currAns, setCurrAns] = useState([]);
  const [user, setUser] = useState([]);
  const [likes, setLikes] = useState(0);
  const contacts = useSelector((state) => state.contacts);
  const userId = useSelector((state) => state.UserId);
  const token = useSelector((state) => state.Token);
  const [pageIdQues, setPageIdQues] = useState(0);
  const [pageIdAns, setPageIdAns] = useState(0);
  const pageSize = 2;
  const [fullAns, setFullAns] = useState([]);
  const [currQues, setCurrQues] = useState([]);
  const baseURI = process.env.REACT_APP_BASE_URI_BACKEND;

  useEffect(() => {
    const intervalId = setInterval(() => {
      getUser();
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    getCurrQues();
  }, [pageIdQues]);

  useEffect(() => {
    setanswers(fullAns);
  }, [pageIdAns]);


  const getLengthQuestions = async () => {
    const data = await fetch(`${baseURI}/api/v1/ques/getTotalQuestions/${userId}`, {
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

  const getCurrQues = async () => {
    const data = await fetch(
      `${baseURI}/api/v1/ques/getAllQuestionsByUser/${userId}/${pageIdQues}/${pageSize}`,
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
      `${baseURI}/api/v1/answer/getUserAnswers/${userId}`,
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
    const data = await fetch(`${baseURI}/api/v1/auth/getuserbyid/${userId}`, {
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
    if ((user.likes !== likes || user.questionsAsked !== quesLength || user.questionsAnswered !== fullAns.length) && user._id) {
      const res = await fetch(`${baseURI}/api/v1/auth/updateuserbyid/${user._id}`, {
        method: "PUT",
        headers:
        {
          "Content-Type": "application/json",
          "auth-header": token,
        },
        body:
          JSON.stringify({
            totalLikes: likes,
            questionsAnswered: fullAns.length,
            questionsAsked: quesLength,
          })
      });
      const data = await res.json();
      if (res.status === 200) {
        setUser(data);
      }
    }
  }

  const GetData = async () => {
    await Promise.all([getUser(), getAns()]);
    await updateUser();
  }
  useEffect(() => {
    GetData();
    getLengthQuestions();
    getAns();
  }, [userId]);

  const handleChat = () => {
    const contact = contacts.find((contact) => contact.chatId === user.ChatId);
    if (contact) {
      navigate("/chatting");
      return;
    }
    else {
      dispatch(addContact(user.ChatId, user.name));
      dispatch(addConversations([user.ChatId], []));
      navigate("/chatting");
    }
  };
  const handlePayment = () => {
    dispatch(SetPaymentInfo({ UPI_Id: user.UPIid }));
    navigate("/payment");
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
            <img
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
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div>{user.name}</div>
          <div>Rating : {getStars(fullAns.length, likes, quesLength)}</div>
          <div>{getTimeDiff(user.LastActive) < 60001 ? "Online" : "Offline"}</div>
          <div>{user.email}</div>
          <div>{user.interestedTopics && user.interestedTopics.join(", ")}</div>
          <div>{user.UPIid}</div>
          <div>{user.BestAnswers && user.BestAnswers.length} best Answers</div>
          <div>Chat id: {user.ChatId}
            <img src={copy} alt="copy" width="16px" height="16px" style={{ cursor: "pointer", marginLeft: "10px", marginTop: "-2px" }} onClick={() => {
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
          {quesLength} questions and answered{" "}
          {fullAns && fullAns.length} questions, and recived {likes} likes.
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
          {quesLength === 0
            ? "No question asked"
            : <>{currQues.map((question, index) =>
              <QuesCardProfile key={index} ques={question} />
            )}
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
          <div>
            {fullAns.length === 0
              ? `No answer given`
              : <>{
                currAns.map((answer, index) => (
                  <AnsCard key={index} answer={answer} user={user} />
                ))}
                {(fullAns.length > pageSize) && <div style={{ margin: "1rem" }}>
                  <Pagination pageId={pageIdAns} totalPages={Math.ceil(fullAns.length / pageSize)} setPageId={setPageIdAns} />
                </div>}
              </>}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
