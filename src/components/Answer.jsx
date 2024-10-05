import { useEffect, useState } from "react";
import HtmlToText from "./HtmlToText";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getTimeDifference } from "../Functions/GetTime";
import showAlert from "../Functions/Alert";
import { Button } from "react-bootstrap";
import { addContact, addConversations, SetPaymentInfo, updateAnsId } from "../Redux/Actions";

const Answer = (props) => {
  const { ans, rewardPrice, askedUserId } = props;

  const dispatch = useDispatch();
  const token = localStorage.getItem("auth-token") || "";
  const navigate = useNavigate();
  if (!token || token === "") {
    navigate("/login");
  }

  const [name, setName] = useState("Anonymous");
  const [ChatId, setChatId] = useState("");
  const [UPI_Id, setUPI_Id] = useState("");
  const [votes, setVotes] = useState(ans.upVotes.length - ans.downVotes.length);
  const personalObjectId = useSelector((state) => state.personalObjectId);

  const getUserName = async () => {
    const data = await fetch(
      `http://localhost:5000/api/v1/auth/getuserbyid/${ans.user}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-header": token,
        },
      }
    );
    const user = await data.json();
    if (data.status === 200) {
      setName(user.name);
      setChatId(user.ChatId);
      setUPI_Id(user.UPIid);
    } else if (user.error && (user.error === "Enter the token" || user.error === "Please authenticate using a valid token")
    ) {
      navigate("/login");
    } else {
      showAlert({
        title: user.error ? user.error : user ? user : "Something went wrong",
        icon: "error",
      });
    }
  };

  const handleBestAnswerClick = async (e, id, userid) => {
    e.preventDefault();
    const data = await fetch(
      "http://localhost:5000/api/v1/auth/bestanswer",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-header": token,
        },
        body: JSON.stringify({ answerId: id, answeredPersonId: userid })
      }
    );
    const ans = await data.json();
    if (data.status === 200) {
      showAlert({
        title: "Best Answer Selected",
        icon: "success",
      });
    } else if (
      ans.error === "Enter the token" ||
      ans.error === "Please authenticate using a valid token"
    ) {
      navigate("/login");
    } else {
      showAlert({
        title: ans.error ? ans.error : ans ? ans : "Something went wrong",
        icon: "error",
      });
    }

  }

  const handleDelete = async (e, id) => {
    e.preventDefault();
    const data = await fetch(`http://localhost:5000/api/v1/answer/deleteAnswer/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-header": token,
        }
      });
    const ans = await data.json();
    if (data.status === 200) {
      showAlert({
        title: "Answer Deleted",
        icon: "success",
      });
    } else if (
      ans.error === "Enter the token" ||
      ans.error === "Please authenticate using a valid token"
    ) {
      navigate("/login");
    } else {
      showAlert({
        title: ans.error ? ans.error : ans ? ans : "Something went wrong",
        icon: "error",
      });
    }
  }
  
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

  const handlePayment = () => {
    dispatch(SetPaymentInfo({
      UPI_Id: UPI_Id,
      Amount: rewardPrice
    }))
    navigate("/payment");
  };

  useEffect(() => {
    getUserName();
  }, []);

  const upVote = async (id) => {
    const data = await fetch(
      `http://localhost:5000/api/v1/answer/upvote/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-header": token,
        },
      }
    );
    const ans = await data.json();
    if (data.status === 200) {
      setVotes(ans);
    } else if (
      ans.error === "Enter the token" ||
      ans.error === "Please authenticate using a valid token"
    ) {
      navigate("/login");
    } else {
      showAlert({
        title: ans.error ? ans.error : ans ? ans : "Something went wrong",
        icon: "error",
      });
    }
  };

  const downVote = async (id) => {
    const data = await fetch(
      `http://localhost:5000/api/v1/answer/downvote/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-header": token,
        },
      }
    );
    const ans = await data.json();
    if (data.status === 200) {
      setVotes(ans);
      return;
    } else if (
      ans.error === "Enter the token" ||
      ans.error === "Please authenticate using a valid token"
    ) {
      navigate("/login");
    } else {
      showAlert({
        title: ans.error ? ans.error : ans ? ans : "Something went wrong",
        icon: "error",
      });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        border: "2px solid rgb(148 138 138)",
        padding: "10px",
        borderRadius: "20px",
        marginTop: "1rem",
      }}
    >
      <div
        style={{
          width: "6%",
          display: "flex",
          flexDirection: "column",
          margin: "auto auto",
          minWidth: "40px",
          gap: "10px",
        }}
      >
        <i
          className="fa-regular fa-thumbs-up"
          style={{ fontSize: `${askedUserId === personalObjectId ? "1rem" : "1.5rem"}`, margin: "auto" }}
          onClick={() => upVote(ans._id)}
        ></i>
        <div style={{ textAlign: "center" }}>{votes}</div>
        <i
          className="fa-regular fa-thumbs-down"
          style={{ fontSize: `${askedUserId === personalObjectId ? "1rem" : "1.5rem"}`, margin: "auto" }}
          onClick={() => downVote(ans._id)}
        ></i>
        {
          askedUserId === personalObjectId ? <i className="fa-regular fa-heart" style={{ margin: 'auto', fontSize: "1.2rem" }} onClick={(e) => handleBestAnswerClick(e, ans._id, ans.user)}></i> : null
        }
      </div>
      <div style={{ width: "94%", paddingLeft: "20px" }}>
        <div>
          {<HtmlToText html={ans.answer} index={ans._id} isfull={true} />}
        </div>
        {ans.user === personalObjectId ?
          <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between", alignContent: "center" }}>
            <div style={{ justifyContent: "center", display: 'flex', fontSize: "1.4rem" }}>
              <div style={{ margin: "0.5rem 1rem" }}>
                <i className="fa-regular fa-pen-to-square fa-beat" style={{ cursor: "pointer" }} onClick={() => {
                  dispatch(updateAnsId(ans._id));
                  navigate(`/editAnswer/${ans._id}`);
                }}>
                </i>
              </div>
              <div style={{ margin: "0.5rem 1rem" }}>
                <i className="fa-solid fa-trash-can fa-beat" style={{ cursor: "pointer" }} onClick={(e) => handleDelete(e, ans._id)}>
                </i>
              </div>
            </div>
            <div style={{ width: "full", display: 'flex', margin: "1rem" }}>
              Answered : {getTimeDifference(ans.date)} by you  </div>
          </div> : <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between" }}>
            <div style={{ justifyContent: "center", display: 'flex' }}>
              <div style={{ margin: "0 1rem" }}>
                <Button variant="primary" onClick={() => {
                  handleChat();
                }}>Chat with {name}</Button>
              </div>
              <div style={{ margin: "0 1rem" }}>
                <Button variant="primary" onClick={() => handlePayment()}>Pay to {name}</Button>
              </div>
            </div>
            <div style={{ width: "full", display: 'flex', margin: "0 1rem" }}>
              Answered : {getTimeDifference(ans.date)} by {name}
            </div>
          </div>}
      </div>
    </div>
  );
};

export default Answer;
