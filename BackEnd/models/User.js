const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');
const saltRounds = 10

const UserSchema = new Schema({
    name:{
        type: String,
        required: true,
        min: [3,"Enter a valid Name"],
    },
    email:{
        type : String,
        required : true,
        unique:true
    },
    password:{
        type : String,
        required : true,
        min : [6,"Enter strong password"]
    },
    interestedTopics:{
        type : [String],
        default:["General"],
    } ,
    date:{
        type : Date,
        default : Date.now
    },
    questionsAsked:{
        type : Number,
        default : 0
    },
    questionsAnswered:{
        type : Number,
        default : 0
    },
    totalLikes:{
        type : Number,
        default : 0
    },
    dp:{
        type:Buffer,
        default:null
    }
});

UserSchema.pre('save',async function (next) {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(this.password, salt);
        this.password = hash;
        next();
    } catch (error) {
        next(error);
    }
}); 

const User = mongoose.model("user",UserSchema)   
module.exports = User;