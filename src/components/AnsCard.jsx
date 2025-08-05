import { useNavigate } from "react-router-dom";
import HtmlToText from "./HtmlToText";
import { useDispatch } from "react-redux";
import { setQuesId } from "../Redux/Actions";
import { getTimeDifference } from "../Functions/GetTime";
import { Card } from "react-bootstrap";

const AnsCard = ({ answer, user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleQuestionClick = (id) => {
    dispatch(setQuesId(id));
    navigate(`/question/${id}`);
  };

  return (
    <Card style={{ width: "100%", marginTop: "1rem" }}>
      <Card.Body>
        <Card.Title
          style={{ cursor: "pointer" }}
          onClick={(e) => {
            e.preventDefault();
            handleQuestionClick(answer.question.id);
          }}
        >
          <HtmlToText
            html={answer.question.html}
            index={answer._id}
            isfull={false}
          />
        </Card.Title>
        <Card.Text>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div style={{ margin: "10px", marginLeft: 0 }}>
              {answer.upVotes.length - answer.downVotes.length} likes received
            </div>
            {user?.BestAnswers?.includes(answer._id) && (
              <div style={{ margin: "10px" }}>Best Answer</div>
            )}
            <div style={{ margin: "10px" }}>
              {getTimeDifference(answer.date)}
            </div>
          </div>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default AnsCard;