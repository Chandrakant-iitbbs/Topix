import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserId } from "../Redux/Actions";

const UserCard = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = props;

  let { name, interestedTopics, dp, questionsAnswered, questionsAsked, totalLikes } = user;
  if (interestedTopics.length > 3) {
    interestedTopics = interestedTopics.slice(0, 3);
  }
  const getStar = () => {
    let n = 1 + 1.7 * (questionsAnswered / (10 + questionsAnswered)) + 1.3 * (totalLikes / (50 + totalLikes)) + (questionsAsked / (20 + questionsAsked));
    n = Math.round(n);
    let stars = "";
    for (let i = 0; i < n; i++) {
      stars += "⭐";
    }
    return stars;
  };

  return (
    <div
      style={{
        minWidth: "300px",
        width: "21rem",
        margin: "10px 10px",
        padding: "10px 10px",
        textWrap: "wrap",
        display: "flex",
        flexDirection: "row",
        border: "1.4px solid gray",
        borderRadius: "5px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          width: "90px",
        }}
      >
        <img
          src={`data:image/jpeg;base64,${dp}`}
          alt=""
          width="70px"
          height="70px"
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontSize: "20px" }} onClick={ () => {
          dispatch(setUserId(user._id));
          navigate(`/profile/${user._id}`);
        }
        }>{name}</span>
        <span>{getStar()}</span>
        <span>{interestedTopics.map((topic) => topic).join(", ")}</span>
      </div>
    </div>
  );
};

export default UserCard;
