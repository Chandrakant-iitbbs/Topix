import { useEffect, useState } from "react";
import JoditEditor from "jodit-react";
import { Button } from "react-bootstrap";
import Answer from "./Answer";
import HtmlToText from "./HtmlToText";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getTimeDifference } from "../Functions/GetTime";
import showAlert from "../Functions/Alert";
import { addContact, addConversations, setUserId } from "../Redux/Actions";
import Pagination from "./Pagination";

const Question = () => {
  const dispatch = useDispatch();

  const id = useSelector((state) => state.QuesId);
  const token = useSelector((state) => state.Token);
  const navigate = useNavigate();
  const [ques, setQues] = useState();
  const [answers, setAnswers] = useState([]);
  const [name, setName] = useState("Anonymous");
  const [addAnswer, setAddAnswer] = useState("");
  const isWrap = window.innerWidth < 900;
  const [ChatId, setChatId] = useState("");
  const [askedUserId, setAskedUserId] = useState("");
  const PersonalObjectId = useSelector((state) => state.personalObjectId);
  const [pageIdAns, setPageIdAns] = useState(0);
  const [totalPagesAns, setTotalPagesAns] = useState([]);
  const pageSize = 5;
  const [totalAnswersLength, setTotalAnswersLength] = useState(0);

  const getAnswersLength = async () => {
    const data = await fetch(
      `http://localhost:5000/api/v1/answer/getAnswersLength/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-header": token,
        },
      }
    );
    const a = await data.json();
    if (data.status === 200) {
      setTotalAnswersLength(a);
      let pages = Math.ceil(a / pageSize);
      let arr = [];
      for (let i = 0; i < pages; i++) {
        arr.push(i);
      }
      setTotalPagesAns(arr);
    } else if (a.error && (a.error === "Enter the token" || a.error === "Please authenticate using a valid token")) {
      navigate("/login");
    } else {
      showAlert({
        title: a.error ? a.error : a ? a : "Internal server error",
        icon: "error",
      });
    }
  };

  useEffect(() => {
    getAnswersLength();
  }, []);

  useEffect(() => {
    fetchAnswers();
  }, [pageIdAns]);



  const deleteQuestion = async (e, id) => {
    e.preventDefault();
    const res = await fetch(
      `http://localhost:5000/api/v1/ques/deleteQuestion/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-header": token,
        },
      }
    );
    const a = await res.json();
    if (res.status === 200) {
      showAlert({
        title: "Question deleted successfully",
        icon: "success",
      });
      navigate("/questions");
      // todo : remove the answers of the question
    } else if (a.error && (a.error === "Enter the token" || a.error === "Please authenticate using a valid token")) {
      navigate("/login");
    } else {
      showAlert({
        title: a.error ? a.error : a ? a : "Internal server error",
        icon: "error",
      });
    }
  };


  const getUserName = async (user) => {
    const data = await fetch(
      `http://localhost:5000/api/v1/auth/getuserbyid/${user}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-header": token,
        },
      }
    );
    const res = await data.json();
    if (data.status === 200) {
      setName(res.name);
      setChatId(res.ChatId);
      setAskedUserId(res._id);
    } else if (res.error && (res.error === "Enter the token" || res.error === "Please authenticate using a valid token")) {
      navigate("/login");
    } else {
      showAlert({
        title: res.error ? res.error : res ? res : "Internal server error",
        icon: "error",
      });
    }
  };

  const htmlToPlainText = (html) => {
    let tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    let plainText = htmlToPlainText(addAnswer);
    plainText = plainText.replace(/\s/g, "").trim();
    if (plainText === "") {
      showAlert({
        title: "Answer can not be empty",
        icon: "error",
      });
      return;
    }

    const res = await fetch(
      `http://localhost:5000/api/v1/answer/addAnswer/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-header": token,
        },
        body: JSON.stringify({
          answer: addAnswer,
        }),
      }
    );
    const a = await res.json();
    if (res.status === 200) {
      showAlert({
        title: "Answer added successfully",
        icon: "success",
      });
      setAddAnswer("");
      fetchAnswers();
    } else if (a.error && (a.error === "Enter the token" || a.error === "Please authenticate using a valid token")) {
      navigate("/login");
    } else {
      showAlert({
        title: a.error ? a.error : a ? a : "Internal server error",
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
    setAnswers([]);
    const data = await fetch(
      `http://localhost:5000/api/v1/answer/getAnswers/${id}/${pageIdAns}/${pageSize}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-header": token,
        },
      }
    );
    const a = await data.json();
    if (data.status === 200) {
      setAnswers(a);
    } else if (a.error && (a.error === "Enter the token" || a.error === "Please authenticate using a valid token")) {
      navigate("/login");
    } else {
      showAlert({
        title: a.error ? a.error : a ? a : "Internal server error",
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
          "auth-header": token,
        },
      }
    );
    const q = await data.json();
    if (data.status === 200) {
      getUserName(q.user);
      setQues(q);
    } else if (q.error && (q.error === "Enter the token" || q.error === "Please authenticate using a valid token")) {
      navigate("/login");
    } else {
      showAlert({
        title: q.error ? q.error : q ? q : "Internal server error",
        icon: "error",
      });
    }
  };

  const contacts = useSelector((state) => state.contacts);
  const handleChat = () => {
    const contact = contacts.find((contact) => contact.chatId === ChatId);
    if (contact) {
      navigate("/chatting");
      return;
    }
    else {
      dispatch(addContact(ChatId, name));
      dispatch(addConversations([ChatId], []));
      navigate("/chatting");
    }
  };

  useEffect(() => {
    fetchQuestion();
    fetchAnswers();
  }, []);
  return (
    <div style={{ margin: "20px 20px" }}>
      {ques ? (
        <div style={{ width: "95%", margin: "auto", padding: "10px" }}>
          <div>{<HtmlToText html={ques.question} index={ques._id} isfull={true} />}</div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
              gap: "10px",
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
              Answers: {totalAnswersLength}
            </div>
            <div
              style={{
                minWidth: "300px",
                textAlign: "left",
                marginRight: "10px",
              }}
            >
              Asked : {getTimeDifference(ques.date)} by <span style={{ cursor: "pointer" }} onClick={(e) => {
                e.preventDefault();
                dispatch(setUserId(ques.user));
                navigate(`/profile/${ques.user}`);
              }}> {ques.user === PersonalObjectId ? "You" : name}</span>
            </div>
            {ques.user === PersonalObjectId ? (<>
              <div>
                <Button style={{ marginRight: "10px" }}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/editQuestion/${ques._id}`);
                  }}
                >
                  Edit
                </Button>
              </div>
              <div>
                <Button
                  onClick={(e) => deleteQuestion(e, ques._id)}
                >
                  Delete
                </Button>
              </div>
            </>
            ) : (<div>
              <Button onClick={(e) => {
                e.preventDefault();
                handleChat();
              }}>
                Chat with {name}
              </Button>
            </div>)}
          </div>
          <hr></hr>
          <div style={{ textWrap: "wrap", margin: "1rem 0" }}>
            {ques.alreadyKnew && < HtmlToText html={ques.alreadyKnew} index={ques._id + 'c'} isfull={true} />}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {ques.tags.map((tag, index) => (
              <span key={index}
                style={{
                  paddingLeft: "5px",
                  paddingRight: "5px",
                  border: "1px solid gray",
                  borderRadius: "5px",
                  backgroundColor: "#d3d3d3",
                  margin: "5px"
                }}
              >
                {tag}
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
              return <Answer ans={ans} key={index} rewardPrice={ques.rewardPrice} askedUserId={askedUserId} />;
            })}
           <Pagination totalPages={totalPagesAns} setPageId={setPageIdAns} pageId={pageIdAns} />
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
