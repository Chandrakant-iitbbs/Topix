const express = require('express');
const router = express.Router();
const FetchUser = require('../middleWare/FetchUser');
const Answer = require('../models/Answer');
const Ques = require('../models/Ques');

// ROUTE 1
// get all the answers of the user using : Get "/api/v1/ans/getAllAnswers". Login required
router.get("/getAllAnswers", FetchUser, async (req, res) => {
    try {
        const answers = await Answer.find({ user: req.user.id });   
        res.json(answers);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
});

// ROUTE 2
// Add a new answer of the user using : post "/api/v1/ans/addAnswer". Login required
router.post("/addAnswer/:QId", FetchUser, async (req, res) => {
    try {
        const ques = await Ques.findById(req.params.QId);
        if (!ques) {
           return res.status(404).send("Question not found");
        }
        const { answer } = req.body;
        if (!answer) {
            return res.status(400).send("Please enter your answer");
        }
        let ans = {};
        ans.user = req.user.id;
        ans.question = req.params.QId;
        ans.answer = answer;
        const result = await Answer(ans);
        const saveAnswer = await result.save();
        res.status(200).json(saveAnswer);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
}); 

// ROUTE 3
// Update an answer of the user using : put "/api/v1/ans/updateAnswer". Login required
router.put("/updateAnswer/:id", FetchUser, async (req, res) => {
    try {
        let ans = await Answer.findById(req.params.id);
        if (!ans) {
            return res.status(404).send("Answer not found");
        }
        if (ans.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed");
        }

        const { answer } = req.body;
        if (!answer) {
            return res.status(400).send("Please enter your answer");
        }
        let newAnswer = {};
        newAnswer.answer = answer;
        ans = await Answer.findByIdAndUpdate(req.params.id, { $set: newAnswer }, { new: true });
        res.json({ ans });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
});

// ROUTE 4
// Delete an answer of the user using : delete "/api/v1/ans/deleteAnswer". Login required
router.delete("/deleteAnswer/:id", FetchUser, async (req, res) => {
    try {
        let ans = await Answer.findById(req.params.id);
        if (!ans) {
            return res.status(404).send("Answer not found");
        }
        if (ans.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed");
        }
        ans = await Answer.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Answer has been deleted", ans });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
});

// ROUTE 5
// Get a single answer of the user using : Get "/api/v1/ans/getAnswer". Login required
router.get("/getAnswer/:id", FetchUser, async (req, res) => {
    try {
        let ans = await Answer.findById(req.params.id);
        if (!ans) {
            return res.status(404).send("Answer not found");
        }
        res.json(ans);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
});

module.exports = router;