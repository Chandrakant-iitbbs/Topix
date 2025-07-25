const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');
const saltRounds = 10

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false,
    },
    googleId: {
        type: String,
        default: null
    },
    isGoogleUser: {
        type: Boolean,
        default: false 
    },
    interestedTopics: {
        type: [String],
    },
    date: {
        type: Date,
        default: Date.now
    },
    questionsAsked: {
        type: Number,
        default: 0
    },
    questionsAnswered: {
        type: Number,
        default: 0
    },
    totalLikes: {
        type: Number,
        default: 0
    },
    dp: {
        type: String
    },
    UPIid: {
        type: String
    },
    ChatId: {
        type: String
    },
    BestAnswers: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'answer' }
    ],
    LastActive: {
        type: Date,
        default: Date.now
    }
});

UserSchema.pre('save', async function (next) {
    try {
        if (this.password && this.isModified('password')) {
            const salt = await bcrypt.genSalt(saltRounds);
            const hash = await bcrypt.hash(this.password, salt);
            this.password = hash;
        }
        next();
    } catch (error) {
        next(error);
    }
});

const User = mongoose.model("user", UserSchema)
module.exports = User;