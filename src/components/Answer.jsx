import { useEffect, useState } from "react";
import HtmlToText from "./HtmlToText";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {getTimeDifference} from "../Functions/GetTime";
import showAlert from "../Functions/Alert";

const Answer = (props) => {
  const token = localStorage.getItem("auth-token") || "";
  const navigate = useNavigate();
  if (!token || token === "") {
    navigate("/login");
  }

  let { ans } = props;

  const [name, setName] = useState("Anonymous");
  const [votes, setVotes] = useState(ans.upVotes.length - ans.downVotes.length);

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
    }  else if (
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
    }  else if (
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
          style={{ fontSize: "1.6rem", margin: "auto" }}
          onClick={() => upVote(ans._id)}
        ></i>
        <div style={{ textAlign: "center" }}>{votes}</div>
        <i
          className="fa-regular fa-thumbs-down"
          style={{ fontSize: "1.6rem", margin: "auto" }}
          onClick={() => downVote(ans._id)}
        ></i>
      </div>
      <div style={{ width: "94%", paddingLeft: "20px" }}>
        <div>
          {<HtmlToText html={ans.answer} index={ans._id} isfull={true} />}
        </div>
        <div style={{ marginTop: "1rem" }}>
          {" "}
          Answered : {getTimeDifference(ans.date)} by {name}
        </div>
      </div>
    </div>
  );
};

export default Answer;
