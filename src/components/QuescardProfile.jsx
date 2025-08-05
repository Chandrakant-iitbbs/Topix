import { useNavigate } from "react-router-dom";
import HtmlToText from "./HtmlToText";
import { useDispatch } from "react-redux";
import { setQuesId } from "../Redux/Actions";
import { getTimeDifference } from "../Functions/GetTime";
import { Card } from "react-bootstrap";

const QuesCardProfile = (props) => {
  const { ques } = props;
  const { question, rewardPrice, tags, views, date, _id } = ques;

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const handleQuesClick = (e) => {
    e.preventDefault();
    dispatch(setQuesId(_id));
    navigate(`/question/${_id}`);
  };

  return (
    // <div
    //   style={{
    //     display: "flex",
    //     flexDirection: "row",
    //     width: "100%",
    //     margin: "5px",
    //     border: "2px solid red",
    //     padding: "5px",
    //     borderRadius: "20px",
    //     justifyContent: "space-between",
    //   }}
    // >
    //   <div style={{ width: "20%", padding: "5px", minWidth: "80px" }}>
    //     <div>Reward price: {rewardPrice}</div>
    //     <div>Views: {views.length}</div>
    //   </div>

    //   <div style={{ width: "60%" }}>
    //     <div
    //       style={{ fontSize: "1.5rem", cursor: "pointer" }}
    //       onClick={(e) => handleQuesClick(e)}
    //     >
    //       <HtmlToText html={question} index={_id} isfull={false} />
    //     </div>
    //     <div style={{ fontSize: "1rem" }}>Tags: {tags.join(", ")}</div>
    //     <div
    //       style={{
    //         fontSize: "1rem",
    //         justifyContent: "space-between",
    //         display: "flex",
    //         flexDirection: "row",
    //       }}
    //     >
    //     </div>
    //   </div>
    //   <div style={{ marginRight: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>{getTimeDifference(date)}</div>
    // </div>
    <Card
      style={{
        width: "100%",
        marginTop: "1rem",
      }}
      key={_id}
    >
      <Card.Body>
        <Card.Title style={{ cursor: "pointer" }} onClick={(e) => {
          e.preventDefault();
          handleQuesClick(e)
        }}>
          {
            <HtmlToText
              html={question}
              index={_id}
              isfull={false}
            />
          }
        </Card.Title>
        <Card.Text>
          <div style={{
            display: "flex", justifyContent: "space-between", flexWrap: "wrap",
            gap: "10px"
          }}>
            <div style={{ margin: "10px", marginLeft: 0 }}>{views.length} views
            </div>
            <div style={{ margin: "10px", marginLeft: 0 }}>Reward Price: {rewardPrice}
            </div>
            <div style={{ margin: "10px", marginLeft: 0 }}>Tags: {tags.join(", ")}</div>
            <div style={{ margin: "10px" }}>{getTimeDifference(date)}</div>
          </div>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default QuesCardProfile;
