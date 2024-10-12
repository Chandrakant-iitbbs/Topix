const mongoose = require("mongoose");
const { Schema } = mongoose;

const AnswerSchema = new Schema({
    user: {
        type : mongoose.Schema.Types.ObjectId, 
        ref : "user"   // set reference as user.
    },
    question: {
        type : mongoose.Schema.Types.ObjectId, 
        ref : "Ques"   // set reference as Ques.
    },
    answer:{
        type: String,
        required: true,
    },
    upVotes:[
        { type: Schema.Types.ObjectId, ref: "user" }
    ],
    downVotes:[
        { type: Schema.Types.ObjectId, ref: "user" }
    ],
    date:{
        type : Date,
        default : Date.now
    },
    isBestAnswer:{
        type: Boolean,
        default: false
    }
});

const Answer = mongoose.model("answer",AnswerSchema) 
module.exports = Answer;