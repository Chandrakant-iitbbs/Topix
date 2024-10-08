import { useState, useEffect, useRef } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import Select from "react-select";
import JoditEditor from "jodit-react";
import makeAnimated from "react-select/animated";
import showAlert from "../Functions/Alert";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import showPrompt from "../Functions/Prompt";

const EditQuestion = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("auth-token") || "";
  const animatedComponents = makeAnimated();
  const isWrap = window.innerWidth < 900;
  const config = {
    readonly: false,
    uploader: {
      insertImageAsBase64URI: true,
    },
    toolbarAdaptive: isWrap,
    height: 300,
    hidePoweredByJodit: true,
    speechRecognize: true,
    beautifyHTMLbeautifyHTML: true,
    usePopupForSpecialCharacters: true,
    showTooltipDelay: 0,
    useNativeTooltip: true,
    saveSelectionOnBlur: true,
  };

  const questionRef = useRef("");
  const alreadyKnewRef = useRef("");
  const id = useSelector((state) => state.QuesId);

  const config2 = { ...config, height: 260 };

  const [info, setInfo] = useState({
    ques: "",
    alreadyKnew: "",
    rewardPrice: 0,
    tags: [],
  });

  useEffect(() => {
    fetchQuestion();
  }, []);

  const fetchQuestion = async () => {
    const data = await fetch(
      `http://localhost:5000/api/v1/ques/getQuestion/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-header": token,
        },
      }
    );
    const a = await data.json();
    if (data.status === 200) {
      setInfo({
        ques: a.question,
        alreadyKnew: a.alreadyKnew,
        rewardPrice: a.rewardPrice,
        tags: a.tags,
      });
    } else if (a.error && (a.error === "Enter the token" || a.error === "Please authenticate using a valid token")) {
      navigate("/login");
    } else {
      showAlert({
        title: a.error ? a.error : a ? a : "Internal server error",
        icon: "error",
      });
    }
    return
  };

  const htmlToPlainText = (html) => {
    let tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const HandleSubmit = async (e) => {
    e.preventDefault();
    let { ques, alreadyKnew, rewardPrice, tags } = info;

    let plainText = htmlToPlainText(ques);
    plainText = plainText.replace(/\s/g, "").trim();
    if (rewardPrice < 0) {
      showAlert({
        icon: "error",
        title: "Reward price can't be negative",
      });
      return;
    }

    if (tags.length === 0) {
      tags.push("General");
    }
    if (plainText === "") {
      showAlert({
        icon: "error",
        title: "Question can't be empty",
      });
      return;
    }

    const res = await fetch(`http://localhost:5000/api/v1/ques/updateQuestion/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-header": token,
      },
      body: JSON.stringify({
        question: ques,
        alreadyKnew,
        rewardPrice,
        tags,
      }),
    });
    const data = await res.json();
    if (res.status === 200) {
      showAlert({
        title: "Question updated successfully",
        icon: "success",
      });
      setInfo({ ques: "", alreadyKnew: "", rewardPrice: 0, tags: [] });
      navigate(`/question/${id}`);
    }
    else if (data.error === "Enter the token" || data.error === "Please authenticate using a valid token") {
      navigate("/login");
    } else {
      showAlert({
        title: data.error ? data.error : data ? data : "Something went wrong",
        icon: "error",
      });
    }
  };

  const getTags = async () => {
    const response = await fetch(
      "http://localhost:5000/api/v1/tags/getAllTags",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      const data = await response.json();
      setAllTags(data[0].tags);
    }
  };

  const addTag = async (tag) => {
    const response = await fetch("http://localhost:5000/api/v1/tags/addTag", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tag }),
    });
    if (response.status === 200) {
      const data = await response.json();
      setAllTags(data.tags);
    }
  };

  useEffect(() => {
    getTags();
  }, []);

  const [allTags, setAllTags] = useState([]);
  return (
    <div
      style={{
        width: "90%",
        margin: "auto",
        padding: "1rem",
      }}
    >
      <Form style={{ marginBottom: "2rem" }}>
        <h2 style={{ textAlign: "center" }}>Edit your question</h2>
        <Form.Group as={Row} controlId="tags" style={{ marginBottom: "1rem" }}>
          <Form.Label column sm="2">
            Related tags
          </Form.Label>
          <Col sm="12">
            <Select
              value={info.tags.map((item) => ({ value: item, label: item }))}
              components={animatedComponents}
              closeMenuOnSelect={false}
              options={
                allTags &&
                allTags.map((topic) => ({
                  value: topic,
                  label: topic,
                }))
              }
              isMulti
              onChange={async(e) => {
                if (e.length > 0 && e[e.length - 1].value === "Add a new tag") {
                  let newtag =  await showPrompt({title: "Enter your tag"});
                  if (!newtag) {
                    showAlert({
                      icon: "error",
                      title: "Tag can't be empty",
                    });
                    e = e.slice(0, e.length - 1);
                  } else {
                    newtag = newtag && newtag.trim();
                    e[e.length - 1].value = newtag;
                    e[e.length - 1].label = newtag;
                    if (newtag) {
                      addTag(newtag);
                    }
                  }
                }

                setInfo({ ...info, tags: e.map((item) => item.value) });
              }}
            />
          </Col>
        </Form.Group>

        <Form.Group
          as={Row}
          controlId="reward"
          value={info.rewardPrice}
          style={{ marginBottom: "1rem" }}
        >
          <Form.Label column sm="2">
            Reward price
          </Form.Label>
          <Col sm="12">
            <Form.Control
              type="number"
              placeholder="Enter reward price"
              value={info.rewardPrice}
              onChange={(e) =>
                setInfo({ ...info, rewardPrice: e.target.value })
              }
            />
          </Col>
        </Form.Group>
        <Form.Group
          as={Row}
          controlId="alreadyKnew"
          style={{ marginBottom: "1rem" }}
        >
          <Form.Label column sm="2">
            Already knew
          </Form.Label>
          <Col sm="12">
            <JoditEditor
              iframeBaseUrl=""
              value={info.alreadyKnew}
              config={config2}
              ref={alreadyKnewRef}
              onBlur={(newContent) =>
                setInfo({ ...info, alreadyKnew: newContent })
              }
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="ques">
          <Form.Label column sm="2">
            Question
          </Form.Label>
          <Col sm="12">
            <JoditEditor
              value={info.ques}
              config={config}
              ref={questionRef}
              onBlur={(newContent) => setInfo({ ...info, ques: newContent })}
            />
          </Col>
        </Form.Group>
      </Form>
      <div style={{ display: "flex", justifyContent: "space-evenly", flexWrap: "wrap", gap: "10px" }} >
        <div style={{ margin: "0 1rem" }}>
          <Button
            variant="secondary"
            type="submit"
            style={{
              width: "30%",
              minWidth: "200px",
              marginBottom: "1rem",
              margin: "auto",
              display: "block",
            }}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/question/${id}`);
            }}
          >
            Cancel
          </Button>
        </div>
        <div>
          <Button
            variant="primary"
            type="submit"
            style={{
              width: "30%",
              minWidth: "200px",
              marginBottom: "1rem",
              margin: "auto",
              display: "block",
            }}
            onClick={(e) => HandleSubmit(e)}
          >
            Update
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditQuestion;
