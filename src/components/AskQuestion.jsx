import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import Select from "react-select";
import JoditEditor from "jodit-react";
import makeAnimated from "react-select/animated";
import swal from "sweetalert";

const AskQuestion = () => {
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

  const config2 = { ...config, height: 260 };

  const [info, setInfo] = useState({
    ques: "",
    alreadyKnew: "",
    rewardPrice: 0,
    tags: [],
  });

  function htmlToPlainText(html) {
    return html.replace(/<[^>]*>?/gm, "");
  }

  const HandleSubmit = async (e) => {
    e.preventDefault();
    let { ques, alreadyKnew, rewardPrice, tags } = info;

    let plainText = htmlToPlainText(ques);
    ques = ques.trim();
    alreadyKnew = alreadyKnew.trim();

    if (rewardPrice < 0) {
      swal({
        icon: "error",
        title: "Reward price can't be negative",
      });
      return;
    }

    if (tags.length === 0) {
      tags.push("General");
    }
    if (plainText === "") {
      swal({
        icon: "error",
        title: "Question can't be empty",
      });
      return;
    }

    const res = await fetch("http://localhost:5000/api/v1/ques/addQuestion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-header":localStorage.getItem("auth-token") || "",
      },
      body: JSON.stringify({
        question: ques,
        alreadyKnew: alreadyKnew,
        rewardPrice,
        tags,
      }),
    });
    if (res.status === 200) {
      swal({
        title: "Question added successfully",
        icon: "success",
      });
      setInfo({ ques: "", alreadyKnew: "", rewardPrice: 0, tags: [] });
      return;
    }
    if (res.status === 401) {
      const data = await res.json();
      swal({
        icon: "error",
        title: data.error,
      });
    } else {
      const data = await res.json();
      swal({
        icon: "error",
        title: data,
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
        <h2 style={{ textAlign: "center" }}>Ask a question</h2>
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
              onChange={(e) => {
                if (e.length > 0 && e[e.length - 1].value === "Add a new tag") {
                  let newtag = prompt("Enter your tag");
                  if (newtag === null) {
                    swal({
                      icon: "error",
                      title: "Tag can't be empty",
                    });
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
        onClick={(e) => HandleSubmit(e)}
      >
        Send
      </Button>
    </div>
  );
};

export default AskQuestion;
