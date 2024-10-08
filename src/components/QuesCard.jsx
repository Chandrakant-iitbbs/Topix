import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HtmlToText from "./HtmlToText";
import { useDispatch, useSelector } from "react-redux";
import { setQuesId } from "../Redux/Actions";
import {getTimeDifference} from "../Functions/GetTime";
import showAlert from "../Functions/Alert";

const QuesCard = (props) => {
  const { ques } = props;
  const { user, question, rewardPrice, tags, views, date, _id } = ques;
  const [name, setName] = useState("Anonymous");
  const dispatch = useDispatch();
  const PersonalObjectId = useSelector(state => state.personalObjectId);
  const token = useSelector(state => state.Token);

  const navigate = useNavigate();
  const handleQuesClick = (e) => {
    e.preventDefault();
    dispatch(setQuesId(_id));
    navigate(`/question/${_id}`);
  };

  const getUserName = async () => {
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
    } 
    else if (res.error && (res.error === "Enter the token" || res.error === "Please authenticate using a valid token")) {
      navigate("/login");
    }
    else{
      showAlert({
        title: res.error ? res.error : res ? res : "Something went wrong",
        icon: "error",
      });
    }
  };

  useEffect(() => {
    getUserName();
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
          onClick={(e)=>handleQuesClick(e)}
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
          <div>Asked by: {ques.user === PersonalObjectId?"You":name}</div>
          <div style={{ marginRight: "10px" }}>{getTimeDifference(date)}</div>
        </div>
      </div>
    </div>
  );
};

export default QuesCard;
