const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/YourNotes";
const connectToMongo = () =>{
    mongoose.connect(mongoURI);
    console.log("Successfully connected to Mongo")
}

module.exports = connectToMongo;