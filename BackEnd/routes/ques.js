const express = require('express');
const router = express.Router();
const FetchUser = require('../middleWare/FetchUser');
const Ques = require('../models/Ques');


// ROUTE 1
// get all the questions of the user using : Get "/api/v1/ques/getAllQuestions". Login required
router.get("/getAllQuestions", FetchUser, async (req, res) => {
    try {
        const questions = await Ques.find({ user: req.user.id });   // fetching all questions of user, where user = req.user.id, where req.user is varified user and this is available because of fetchuser middleware.
        res.json(questions);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
});

// ROUTE 2
// Add a new question of the user using : post "/api/v1/ques/addQuestion". Login required
router.post("/addQuestion", FetchUser, async (req, res) => {
    try {
        const { question, alreadyKnew, tags, rewardPrice } = req.body;
        let q = {};
        if (!question) {
            res.status(400).send("Please enter your question");
            return;
        }
        q.user= req.user.id ;
        if (question) {
            q.question = question;
        }
        if (alreadyKnew) {
            q.alreadyKnew = alreadyKnew;}
        if (tags) {
            q.tags = tags;
        }
        if (rewardPrice) {
            q.rewardPrice = rewardPrice;
        }
        const ques = await Ques(q);
        const saveQuestion = await ques.save();
        res.json(saveQuestion);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal1 server error");
    }
});

// ROUTE 3
// update an existing question of the user, corresponing to given id  using : put "/api/v1/ques/updateQuestion". Login required

router.put("/updateQuestion/:id", FetchUser, async (req, res) => {
    try {
        const { question, alreadyKnew, tags, rewardPrice } = req.body;   
        const newNode = {};       // Create a newNote object
        if (!question) {
            res.status(400).send("Please enter your question");
            return;
        }
        if (question) {
            newNode.question = question;
        }
        if (alreadyKnew) {
            newNode.alreadyKnew = alreadyKnew;}
        if (tags) {
            newNode.tags = tags;
        }
        if (rewardPrice) {
            newNode.rewardPrice = rewardPrice;
        }
        let ques = await Ques.findById(req.params.id);  // finding the question by id
        if (!ques) {
            return res.status(404).send("Not Found");
        }

        if (ques.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        ques = await Ques.findByIdAndUpdate(req.params.id, { $set: newNode }, { new: true });
        res.json({ ques });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
});

// ROUTE 4
// delete an existing question of the user, corresponing to given id  using : delete "/api/v1/ques/deleteQuestion". Login required
router.delete("/deleteQuestion/:id", FetchUser, async (req, res) => {
    try {
        let ques = await Ques.findById(req.params.id);  // finding the question by id
        if (!ques) {
            return res.status(404).send("Not Found");
        }

        if (ques.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        ques = await Ques.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Question has been deleted", ques: ques });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
});

//  ROUTE 5
// get all the question by id using : Get "/api/v1/ques/getQuestion". Login required
router.get("/getQuestion/:id", FetchUser, async (req, res) => {
    try {
        let ques = await Ques.findById(req.params.id);  // finding the question by id
        if (!ques) {
            return res.status(404).send("Not Found");
        }

        if (ques.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        res.status(200).json(ques);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
});

module.exports = router;
