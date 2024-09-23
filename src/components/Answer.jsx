import { useEffect, useState } from "react";
import swal from "sweetalert";
import HtmlToText from "./HtmlToText";

const Answer = (props) => {
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
          "auth-header": localStorage.getItem("auth-token") || "",
        },
      }
    );
    if (data.status === 200) {
      const user = await data.json();
      setName(user.name);
    } else if (data.status === 401 || data.status === 404) {
      const user = await data.json();
      swal({
        icon: "error",
        title: user.error ? user.error : user,
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

  useEffect(() => {
    getUserName();
  }, []);

  const htmlToText = (html) => {
    // let doc = new DOMParser().parseFromString(html, "text/html");
    // return doc.body.textContent || "";
    let div = document.createElement("div");
    div.innerHTML = html;
    return div.innerText || div.textContent || "";
  };

  const upVote = async (id) => {
    const data = await fetch(
      `http://localhost:5000/api/v1/answer/upvote/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-header": localStorage.getItem("auth-token") || "",
        },
      }
    );
    if (data.status === 200) {
      const ans = await data.json();
      setVotes(ans);
    } else if (data.status === 401 || data.status === 404) {
      const ans = await data.json();
      swal({
        icon: "error",
        title: ans.error ? ans.error : ans,
      });
    } else {
      swal({
        icon: "error",
        title: "Internal server error",
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
          "auth-header": localStorage.getItem("auth-token") || "",
        },
      }
    );

    if (data.status === 200) {
      const ans = await data.json();
      setVotes(ans);
      return;
    } else if (data.status === 401 || data.status === 404) {
      const ans = await data.json();
      swal({
        icon: "error",
        title: ans.error ? ans.error : ans,
      });
    } else {
      swal({
        icon: "error",
        title: "Internal server error",
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
        <div> {<HtmlToText html={ans.answer} index={ans._id} isfull={true}/>}</div>
        <div style={{ marginTop: "1rem" }}>
          {" "}
          Answered : {getAskedTime(ans.date)} by {name}
        </div>
      </div>
    </div>
  );
};

export default Answer;
