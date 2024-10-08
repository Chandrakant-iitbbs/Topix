import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserId } from "../Redux/Actions";
import { getStars } from "../Functions/GetStars";

const UserCard = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = props;
  let { name, interestedTopics, dp, questionsAnswered, questionsAsked, totalLikes } = user;
  if (interestedTopics.length > 3) {
    interestedTopics = interestedTopics.slice(0, 3);
  }

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
        {dp ? <img
          src={`data:image/jpeg;base64,${dp}`}
          alt=""
          width="70px"
          height="70px"
        /> : <span style={{ width:"70px", height:"70px",fontSize: "2rem", fontWeight: "bold" , display:"flex", alignItems:"center", justifyContent:"center", backgroundColor:"cyan",}}>{name[0].toUpperCase()}</span>}
        
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontSize: "20px", cursor:"pointer" }} onClick={ (e) => {
          e.preventDefault();
          dispatch(setUserId(user._id));
          navigate(`/profile/${user._id}`);
        }
        }>{name}</span>
        <span>{getStars(questionsAnswered,totalLikes, questionsAsked)}</span>
        <span>{interestedTopics.map((topic) => topic).join(", ")}</span>
      </div>
    </div>
  );
};

export default UserCard;
