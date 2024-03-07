const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://saboteurshivam:QWERTY12345@cluster0.s5yvk3m.mongodb.net/";
const connectToMongo = () =>{
    mongoose.connect(mongoURI);
    console.log("Successfully connected to Mongo")
}

module.exports = connectToMongo;
