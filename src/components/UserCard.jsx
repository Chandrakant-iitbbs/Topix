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
        border: "1px solid gray",
        borderRadius: "10px",
        backgroundColor: "#E3F2FD"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "90px",
          height:"100%"
        }}
      >
        {dp ? <img
          src={dp}
          alt="User Profile"
          className="rounded-circle"
          width="70px"
          height="70px"
          style={{ borderRadius: "50%", border: "1px solid grey" }}
        /> : <span style={{ width:"70px", height:"70px",fontSize: "2rem", fontWeight: "bold" , display:"flex", alignItems:"center", justifyContent:"center", backgroundColor:"#61a2ff",borderRadius:"50%"}}>{name[0].toUpperCase()}</span>}
      </div>
      <div style={{ display: "flex", flexDirection: "column", marginLeft: "10px",justifyContent:"center" }}>
        <span style={{ fontSize: "20px", cursor:"pointer", fontWeight: "500"
         }} onClick={ (e) => {
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
