import React, { useState, useRef } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import Select from "react-select";
import JoditEditor from "jodit-react";
import makeAnimated from "react-select/animated";

const AskQuestion = () => {
  const animatedComponents = makeAnimated();
  const quesref = useRef("");
  const alreadyKewref = useRef("");
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

  const config2 = { ...config, height: 260 };

  const [info, setInfo] = useState({
    ques: "",
    alreadyKew: "",
    rewardPrice: 0,
    tags: [],
  });

  const HandleSubmit = (info) => {
    console.log(info);
  };

  const [allTags, setAllTags] = useState([
    "Add a new tag",
    "General",
    "React",
    "Angular",
    "Vue",
    "Node",
    "Express",
    "MongoDB",
    "Python",
    "Django",
    "Flask",
    "PostgreSQL",
  ]);

  return (
    <div
      style={{
        width: "90%",
        margin: "auto",
        marginTop: "6rem",
        padding: "1rem",
      }}
    >
      <Form style={{ marginBottom: "2rem" }}>
        <Form.Group as={Row} controlId="tags" style={{ marginBottom: "1rem" }}>
          <Form.Label column sm="2">
            Related tags
          </Form.Label>
          <Col sm="12">
            <Select
              components={animatedComponents}
              closeMenuOnSelect={false}
              options={allTags.map((topic) => ({
                value: topic,
                label: topic,
              }))}
              isMulti
              onChange={(e) => {
                if (e[e.length - 1].value === "Add a new tag") {
                  let newtag = prompt("Enter your tag");
                  e[e.length - 1].value = newtag;
                  e[e.length - 1].label = newtag;
                  let arr1 = allTags.concat(newtag);
                  setAllTags(arr1);
                }
                setInfo({ ...info, tags: e.map((item) => item.value) });
              }}
            />
          </Col>
        </Form.Group>

        <Form.Group
          as={Row}
          controlId="reward"
          style={{ marginBottom: "1rem" }}
        >
          <Form.Label column sm="2">
            Reward price
          </Form.Label>
          <Col sm="12">
            <Form.Control
              type="number"
              placeholder="Enter reward price"
              onChange={(e) => setInfo({ ...info, name: e.target.value })}
            />
          </Col>
        </Form.Group>
        <Form.Group
          as={Row}
          controlId="alreadyKew"
          style={{ marginBottom: "1rem" }}
        >
          <Form.Label column sm="2">
            Already knew
          </Form.Label>
          <Col sm="12">
            <JoditEditor
              iframeBaseUrl=""
              ref={alreadyKewref}
              value={info.alreadyKew}
              config={config2}
              onBlur={(newContent) =>
                setInfo({ ...info, alreadyKew: newContent })
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
              ref={quesref}
              value={info.ques}
              config={config}
              onBlur={(newContent) => setInfo({ ...info, ques: newContent })}
            />
          </Col>
        </Form.Group>
      </Form>
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
        onClick={() => HandleSubmit(info)}
      >
        Send
      </Button>
    </div>
  );
};

export default AskQuestion;
