import { useEffect, useState } from "react";
import swal from "sweetalert";
import JoditEditor from "jodit-react";
import { Button } from "react-bootstrap";
import Answer from "./Answer";

const Question = (props) => {
  let { id } = props;

  const [ques, setQues] = useState();
  const [answers, setAnswers] = useState([]);
  const [name, setName] = useState("Anonymous");
  const [addAnswer, setAddAnswer] = useState("");
  const isWrap = window.innerWidth < 900;

  const getUserName = async (user) => {
    const data = await fetch(
      `http://localhost:5000/api/v1/auth/getuserbyid/${user}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-header": localStorage.getItem("auth-token") || "",
        },
      }
    );
    if (data.status === 200) {
      const user = await data.json();
      setName(user.name);
    } else if (data.status === 401) {
      const user = await data.json();
      swal({
        icon: "error",
        title: user.error,
      });
    } else {
      swal({
        icon: "error",
        title: "Internal server error",
      });
    }
  };

  const getAskedTime = (date) => {
    const currentDate = new Date();
    const askDate = new Date(date);
    let diffTime = currentDate - askDate;

    const yrs = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
    if (yrs > 0) {
      return `${yrs} years ago`;
    }
    diffTime -= yrs * (1000 * 60 * 60 * 24 * 365);
    const months = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30));
    if (months > 0) {
      return `${months} months ago`;
    }
    diffTime -= months * (1000 * 60 * 60 * 24 * 30);

    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (days > 0) {
      return `${days} days ago`;
    }
    diffTime -= days * (1000 * 60 * 60 * 24);
    const hours = Math.floor(diffTime / (1000 * 60 * 60));
    if (hours > 0) {
      return `${hours} hours ago`;
    }

    diffTime -= hours * (1000 * 60 * 60);
    const minutes = Math.floor(diffTime / (1000 * 60));
    if (minutes > 0) {
      return `${minutes} minutes ago`;
    }
    diffTime -= minutes * (1000 * 60);
    const seconds = Math.ceil(diffTime / 1000);
    return `${seconds} seconds ago`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(addAnswer);
    const res = await fetch(
      `http://localhost:5000/api/v1/answer/addAnswer/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-header": localStorage.getItem("auth-token") || "",
        },
        body: JSON.stringify({
          answer: addAnswer,
        }),
      }
    );
    if (res.status === 200) {
      swal({
        title: "Answer added successfully",
        icon: "success",
      });
      setAddAnswer("");
      fetchAnswers();
    } else if (res.status === 401 || res.status === 404) {
      const a = await res.json();
      swal({
        title: a.error ? a.error : a,
        icon: "error",
      });
    } else {
      swal({
        title: "Internal Server Error",
        icon: "error",
      });
    }
  };

  const config = {
    readonly: false,
    uploader: {
      insertImageAsBase64URI: true,
    },
    toolbarAdaptive: isWrap,
    height: 300,
    hidePoweredByJodit: true,
    speechRecognize: true,
    beautifyHTMLbeautifyHTML: true,
    usePopupForSpecialCharacters: true,
    showTooltipDelay: 0,
    useNativeTooltip: true,
    saveSelectionOnBlur: true,
  };

  const fetchAnswers = async () => {
    const data = await fetch(
      `http://localhost:5000/api/v1/answer/getAnswers/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-header": localStorage.getItem("auth-token") || "",
        },
      }
    );
    if (data.status === 200) {
      const a = await data.json();
      setAnswers(a);
    } else if (data.status === 401 || data.status === 404) {
      const a = await data.json();
      swal({
        title: a.error ? a.error : a,
        icon: "error",
      });
    } else {
      swal({
        title: "Internal Server Error",
        icon: "error",
      });
    }
  };

  const fetchQuestion = async () => {
    const data = await fetch(
      `http://localhost:5000/api/v1/ques/getQuestion/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-header": localStorage.getItem("auth-token") || "",
        },
      }
    );
    if (data.status === 200) {
      const q = await data.json();
      getUserName(q.user);
      setQues(q);
    } else if (data.status === 401 || data.status === 404) {
      const q = await data.json();
      swal({
        title: q.error ? q.error : q,
        icon: "error",
      });
    } else {
      swal({
        title: "Internal Server Error",
        icon: "error",
      });
    }
  };

  const htmlToText = (html) => {
    // let div = new DOMParser().parseFromString(html, "text/html");
    // return div.body.textContent || "";
    let div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };
  useEffect(() => {
    fetchQuestion();
    fetchAnswers();
    getAskedTime();
  }, []);
  return (
    <div style={{ margin: "20px 20px" }}>
      {ques ? (
        <div style={{ width: "95%", margin: "auto", padding: "10px" }}>
          <h4>{htmlToText(ques.question)}</h4>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                minWidth: "150px",
                textAlign: "left",
                marginRight: "10px",
              }}
            >
              Reward price: {ques.rewardPrice}
            </div>
            <div
              style={{
                minWidth: "150px",
                textAlign: "left",
                marginRight: "10px",
              }}
            >
              Viewed: {ques.views.length}
            </div>
            <div
              style={{
                minWidth: "150px",
                textAlign: "left",
                marginRight: "10px",
              }}
            >
              Answers: {answers.length}
            </div>
            <div
              style={{
                minWidth: "300px",
                textAlign: "left",
                marginRight: "10px",
              }}
            >
              Asked : {getAskedTime(ques.date)} by {name}
            </div>
          </div>
          <hr></hr>
          <div style={{ textWrap: "wrap", margin: "1rem 0" }}>
            {ques.alreadyKnew && htmlToText(ques.alreadyKnew)}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {ques.tags.map((tag) => (
              <span
                style={{
                  paddingLeft: "5px",
                  paddingRight: "5px",
                  border: "1px solid gray",
                  borderRadius: "5px",
                  backgroundColor: "#d3d3d3",
                }}
              >
                {tag}{" "}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ width: "95%", margin: "auto", padding: "10px" }}>
          <h1>Loading...</h1>
        </div>
      )}

      <div style={{ width: "95%", margin: "auto", padding: "10px" }}>
        {answers.length > 0 ? (
          <div>
            <h2>Answers</h2>
            {answers.map((ans, index) => {
              return <Answer ans={ans} key={index} />;
            })}
          </div>
        ) : (
          <h1>No answers till now...</h1>
        )}
      </div>

      <div style={{ width: "95%", margin: "1rem auto" }}>
        <h3>Add answer</h3>
        <div>
          <JoditEditor
            iframeBaseUrl=""
            value={addAnswer}
            config={config}
            onBlur={(newContent) => setAddAnswer(newContent)}
          />
        </div>
        <div
          style={{ display: "flex", justifyContent: "center", margin: "1rem" }}
        >
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </div>
    </div>
  );
};

export default Question;
