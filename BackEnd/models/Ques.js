const mongoose = require("mongoose");
const { Schema } = mongoose;

const QuesSchema = new Schema({
    user: {
        type : mongoose.Schema.Types.ObjectId, 
        ref : "user"   // set reference as user.
    },
    question:{
        type: String,
        required: true,
    },
    alreadyKnew:{
        type : String,
    },
    rewardPrice:{
        type : Number,
        default : 0,
    },
    tags:{
        type : [String],
        default:["General"],
    },
    views:{
        type : Number,
        default : 0,
    },
    date:{
        type : Date,
        default : Date.now
    }
});


const Ques = mongoose.model("Ques",QuesSchema)   
// User.createIndexes();
module.exports = Ques;