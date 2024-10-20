const mongoose = require('mongoose');

const connectToMongo = (DATABASE_URL)=>{
    mongoose.connect(DATABASE_URL).then(()=>{
        console.log("connected to mongo");
    }).catch((err)=>{
        console.log(err);
    });
}

module.exports = connectToMongo;