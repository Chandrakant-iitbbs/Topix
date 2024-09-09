import React, { useEffect, useState } from "react";
import { Button, Row, Col, Image, Card } from "react-bootstrap";

const User = (props) => {
  const { isOnline } = props;
  const [ques, setQues] = useState([]);
  const [answered, setAnswered] = useState([]);

  const getStar = (n) => {
    let stars = "";
    for (let i = 0; i < n; i++) {
      stars += "⭐";
    }
    return stars;
  };

  const getData = async () => {
    // Todo : Fetch data from API
    setQues([
      {
        _id: "66952e3ca6547cf2a104b5a1",
        user: "66952dd9a6547cf2a104b59e",
        question: "what is NodeJS",
        rewardPrice: 0,
        tags: ["General"],
        date: "2024-07-15T14:12:12.941Z",
        __v: 0,
      },
      {
        _id: "66952efa6fdcca64b2f9690e",
        user: "66952dd9a6547cf2a104b59e",
        question: "what is ReactJS",
        rewardPrice: 0,
        tags: ["General"],
        date: "2024-07-15T14:15:22.933Z",
        __v: 0,
      },
    ]);
    // Todo : Fetch data from API

    setAnswered([
      {
        _id: "6696964ee69351a79bcbdf3b",
        user: "66952dd9a6547cf2a104b59e",
        question: "66950d10fb263ec4824b2d76",
        answer: "i m good",
        likes: 0,
        date: "2024-07-16T15:48:30.062Z",
        __v: 0,
      },
      {
        _id: "669697a0d8bbdd4a6c5f207f",
        user: "66952dd9a6547cf2a104b59e",
        question: "669516d468440015723abed3",
        answer: "nothing",
        likes: 0,
        date: "2024-07-16T15:54:08.494Z",
        __v: 0,
      },
      {
        _id: "669698005f895673472cbbb2",
        user: "66952dd9a6547cf2a104b59e",
        question: "669569a34438342036eb7261",
        answer: "nothing",
        likes: 0,
        date: "2024-07-16T15:55:44.442Z",
        __v: 0,
      },
    ]);
  };

  useEffect(() => {
    getData();
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
    console.log("Question Clicked", id);
  };

  const Base64ToImage = (base64) => {
    return `data:image/jpeg;base64,${base64}`;
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
  // Todo: Fetch user data from API
  const user = {
    name: "John Doe",
    email: "email@email.com",
    interestedTopics: ["tag1", "tag2", "tag3"],
    "UPI id": "upi@upi",
    "Questions Asked": 5,
    "Questions Answered": 10,
    "Total Likes": 100,
    star: 3,
    date: "2024-07-14T20:40:53.049+00:00",
    dp: "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",
  };
  return (
    <div style={{ padding: "1.5rem  1.5rem  1.5rem 3rem", maxWidth: "100%" }}>
      <Row style={{ display: "flex", justifyContent: "center" }}>
        <Col
          style={{
            width: "100%",
            maxWidth: "250px",
            minWidth: "150px",
            justifySelf: "center",
            margin: "10px",
          }}
        >
          <Image
            src={Base64ToImage(user.dp)}
            roundedCircle
            width="100%"
            height="100%"
          />
        </Col>
        <Col
          style={{
            justifyItems: "center",
            alignContent: "center",
            margin: "1rem",
          }}
        >
          <div>{user.name}</div>
          <div>Rating : {getStar(user.star)}</div>
          <div>{user.email}</div>
          <div>{user.interestedTopics.join(", ")}</div>
          <div>{user["UPI id"]}</div>
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
          {user["Questions Asked"]} questions and answered{" "}
          {user["Questions Answered"]} questions, you recived{" "}
          {user["Total Likes"]} likes.
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
                    <Card.Title>{question.question}</Card.Title>
                    <Card.Text>
                      Some quick example text to build on the card title and
                      make up the bulk of the card's content.
                    </Card.Text>
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
                    style={{
                      width: "100%",
                      marginTop: "1rem",
                      cursor: "pointer",
                    }}
                    onClick={() => handleQuestionClick(answer.question)}
                    key={index}
                  >
                    <Card.Body>
                      <Card.Title>{answer.answer}</Card.Title>
                      <Card.Text>
                        Some quick example text to build on the card title and
                        make up the bulk of the card's content.
                      </Card.Text>
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
