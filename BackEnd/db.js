const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/topix";

const connectToMongo = ()=>{
    mongoose.connect(mongoURI).then(()=>{
        console.log("connected to mongo");
    }).catch((err)=>{
        console.log(err);
    });
}

module.exports = connectToMongo;