const express = require('express');
const router = express.Router();
const tags = require('../models/Tags');
const Fetchuser = require('../middleWare/FetchUser');

// ROUTE 1
// get all the tags using : Get "/api/v1/tags/getAllTags"
router.get("/getAllTags", async (req, res) => {
    try {
        const allTags = await tags.find();
        res.status(200).json(allTags);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
});

// ROUTE 2
// add a new tag using : POST "/api/v1/tags/addTag".
router.put("/addTag", async (req, res) => {
    const { tag } = req.body;
    try {
        const tagsTillNow = await tags.findOne();
        if (!tagsTillNow) {
            const newTag = new tags({
                tags: [tag]
            });
            await newTag.save();
            return res.status(200).json(newTag);
        }
        if (tagsTillNow.tags.includes(tag)) {
            return res.status(400).json({ error: "Tag already exists" });
        }

        const newTags = await tags.findByIdAndUpdate(tagsTillNow._id, { $push: { tags: tag } }, { new: true });
        res.status(200).json(newTags);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }

});

module.exports = router;