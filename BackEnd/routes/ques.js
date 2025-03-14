const express = require('express');
const router = express.Router();
const FetchUser = require('../middleWare/FetchUser');
const Ques = require('../models/Ques');
const Answer = require('../models/Answer');

// ROUTE 1
// get all the questions of the user using : Get "/api/v1/ques/getAllQuestions". Login required
router.get("/getAllQuestionsOfUser/:pageIdQues/:pageSize", FetchUser, async (req, res) => {
    try {
        const pageIdQues = parseInt(req.params.pageIdQues);
        const pageSize = parseInt(req.params.pageSize);
        const questions = await Ques.find({ user: req.user.id }).skip(pageIdQues * pageSize).limit(pageSize).sort({ date: -1 });  // fetching all questions of user, where user = req.user.id, where req.user is varified user and this is available because of fetchuser middleware.
        res.status(200).json(questions);
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
            res.status(400).json("Please enter your question");
            return;
        }
        q.user = req.user.id;
        if (question) {
            q.question = question;
        }
        if (alreadyKnew) {
            q.alreadyKnew = alreadyKnew;
        }
        if (tags) {
            q.tags = tags;
        }
        if (rewardPrice) {
            q.rewardPrice = rewardPrice;
        }
        const ques = await Ques(q);
        const saveQuestion = await ques.save();
        res.status(200).json(saveQuestion);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json("Internal server error");
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
            newNode.alreadyKnew = alreadyKnew;
        }
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
        res.status(200).json({ ques });
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
        await Answer.deleteMany({ question: req.params.id });

        res.status(200).json({ "Success": "Question has been deleted", ques: ques });
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

        if (!ques.views.includes(req.user.id)) {
            ques.views.push(req.user.id);
            await ques.save();
        }
        res.status(200).json(ques);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
});

// ROUTE 6
// get all the questions using : Get "/api/v1/ques/getAllQuestions". Login required
router.get("/getAllQuestions/:pageIdQues/:pageSize", FetchUser, async (req, res) => {
    try {
        const pageIdQues = parseInt(req.params.pageIdQues);
        const pageSize = parseInt(req.params.pageSize);
        const questions = await Ques.find().skip(pageIdQues * pageSize).limit(pageSize).sort({ date: -1 });
        res.status(200).json(questions);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
});

// ROUTE 7
// get all the questions in decreasing order of reward price using : Get "/api/v1/ques/getAllQuestionsByReward". Login required
router.get("/getAllQuestionsByReward", FetchUser, async (req, res) => {
    try {
        const questions = await Ques.find().sort({ rewardPrice: -1 });
        res.status(200).json(questions);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
});

// ROUTE 8
// get all questions from a particular tag in decreasing order of reward price using : Get "/api/v1/ques/getAllQuestionsByTagByReward". Login required
router.get("/getAllQuestionsByTagByReward/:tag", FetchUser, async (req, res) => {
    try {
        const questions = await Ques.find({ tags: req.params.tag }).sort({ rewardPrice: -1 });
        res.status(200).json(questions);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
}
);

// ROUTE 9
// get all questions from a particular tag using : Get "/api/v1/ques/getAllQuestionsByTag". Login required
router.get("/getAllQuestionsByTag/:tag", FetchUser, async (req, res) => {
    try {
        const { tag } = req.params;
        let tags = tag.split(",");
        let questions = await Ques.find();
        questions = questions.filter((ques) => {
            return tags.every((tag) => ques.tags.includes(tag));
        });
        res.status(200).json(questions);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
}
);

// ROUTE 10
// get all questions in decreasing order of time of creation using : Get "/api/v1/ques/getAllQuestionsByTime". Login required
router.get("/getAllQuestionsByTime", FetchUser, async (req, res) => {
    try {
        const questions = await Ques.find().sort({ date: -1 });
        res.status(200).json(questions);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
}
);

// ROUTE 11
// get all question by user id using : Get "/api/v1/ques/getAllQuestionsByUser". Login required
router.get("/getAllQuestionsByUser/:id/:pageIdQues/:pageSize", FetchUser, async (req, res) => {
    try {
        const pageIdQues = parseInt(req.params.pageIdQues);
        const pageSize = parseInt(req.params.pageSize);
        const questions = await Ques.find({ user: req.params.id }).skip(pageIdQues * pageSize).limit(pageSize).sort({ date: -1 });
        res.status(200).json(questions);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
}
);

// ROUTE 12
// get Total number of questions of user using : Get "/api/v1/ques/getTotalQuestionsLength". Login required
router.get("/getTotalQuestionsLength", FetchUser, async (req, res) => {
    try {
        const questions = await Ques.find({ user: req.user.id });
        res.status(200).json(questions.length);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
}
);

// ROUTE 13
// get Total number of questions of user by id : Get "/api/v1/ques/getTotalQuestions/:userId". Login required
router.get("/getTotalQuestions/:userId", FetchUser, async (req, res) => {
    try {
        const questions = await Ques.find({ user: req.params.userId });
        res.status(200).json(questions.length);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
}
);

// ROUTE 14
// get total number the questions using : Get "api/v1/ques/getTotalQuestions". Login required
router.get("/getTotalQuestions", FetchUser, async (req, res) => {
    try {
        const questions = await Ques.find();
        res.status(200).json(questions.length);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
}
);


module.exports = router;
