const mongoose = require("mongoose");
const { Schema } = mongoose;


const TagsSchema = new Schema({
    tags: {
        type: [String],
        required: true
    }
});

const tags = mongoose.model("tags", TagsSchema)
module.exports = tags;