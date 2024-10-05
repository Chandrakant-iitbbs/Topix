import JoditEditor from "jodit-react";
import { Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import showAlert from "../Functions/Alert";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const EditAnswer = () => {
    useEffect(() => {
        fetchAnswer();
    }, []);

    const isWrap = window.innerWidth < 900;
    const [addAnswer, setAddAnswer] = useState("");
    const id = useSelector((state) => state.updateAnsId);
    const token = localStorage.getItem("auth-token") || "";
    const navigate = useNavigate();
    const quesId = useSelector((state) => state.QuesId);


    const fetchAnswer = async () => {
        const res = await fetch(`http://localhost:5000/api/v1/answer/getAnswer/${id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-header": token,
                },
            }
        );
        const a = await res.json();
        if (res.status === 200) {
            setAddAnswer(a.answer);
        } else if (a.error && (a.error === "Enter the token" || a.error === "Please authenticate using a valid token")) {
            navigate("/login");
        } else {
            showAlert({
                title: a.error ? a.error : a ? a : "Internal server error",
                icon: "error",
            });
        }
    };


    const htmlToPlainText = (html) => {
        let tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;
        return tempDiv.textContent || tempDiv.innerText || "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let plainText = htmlToPlainText(addAnswer);
        plainText = plainText.replace(/\s/g, "").trim();
        if (plainText === "") {
            showAlert({
                title: "Answer can not be empty",
                icon: "error",
            });
            return;
        }

        const res = await fetch(
            `http://localhost:5000/api/v1/answer/updateAnswer/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "auth-header": token,
                },
                body: JSON.stringify({
                    answer: addAnswer,
                }),
            }
        );
        const a = await res.json();
        if (res.status === 200) {
            showAlert({
                title: "Answer updated successfully",
                icon: "success",
            });
            setAddAnswer("");
            navigate(`/question/${quesId}`);
        } else if (a.error && (a.error === "Enter the token" || a.error === "Please authenticate using a valid token")) {
            navigate("/login");
        } else {
            showAlert({
                title: a.error ? a.error : a ? a : "Internal server error",
                icon: "error",
            });
        }
    };

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
    return (
        <div style={{ width: "90%", margin: "1rem auto" }}>
            <h3>Edit answer</h3>
            <div>
                <JoditEditor
                    iframeBaseUrl=""
                    value={addAnswer}
                    config={config}
                    onBlur={(newContent) => setAddAnswer(newContent)}
                />
            </div>
            <div
                style={{ display: "flex", justifyContent: "space-evenly", margin: "1rem" }}
            >
                <Button style={{backgroundColor:"gray", borderColor:"gray"}} onClick={()=> navigate(`/question/${quesId}`)}>Cancel</Button>
                <Button onClick={handleSubmit}>Submit</Button>
            </div>
        </div>
    );
}

export default EditAnswer;
