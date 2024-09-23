import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import HtmlToText from "./HtmlToText";

const QuesCard = (props) => {
  const { ques, setQuesId } = props;
  const { user, question, rewardPrice, tags, views, date, _id } = ques;
  const [name, setName] = useState("Anonymous");

  const navigate = useNavigate();
  const handleQuesClick = () => {
    setQuesId(_id);
    navigate(`/question/${_id}`);
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

  const getUserName = async () => {
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

  useEffect(() => {
    getUserName();
    getAskedTime();
  }, []);

  const quesText = <HtmlToText html={question} index={_id} isfull={false} />;  

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        margin: "5px",
        border: "2px solid red",
        padding: "5px",
        borderRadius: "20px",
        justifyContent: "space-between",
      }}
    >
      <div style={{ width: "20%", padding: "5px", minWidth: "80px" }}>
        <div>Reward price: {rewardPrice}</div>
        <div>Views: {views.length}</div>
      </div>

      <div style={{ width: "78%" }}>
        <div
          style={{ fontSize: "1.5rem", cursor: "pointer" }}
          onClick={handleQuesClick}
        >
          {quesText}
        </div>
        <div style={{ fontSize: "1rem" }}>Tags: {tags.join(", ")}</div>
        <div
          style={{
            fontSize: "1rem",
            justifyContent: "space-between",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div>Asked by: {name}</div>
          <div style={{ marginRight: "10px" }}>{getAskedTime(date)}</div>
        </div>
      </div>
    </div>
  );
};

export default QuesCard;
