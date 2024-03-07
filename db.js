const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://saboteurshivam:QWERTY12345@cluster0.cozu8rw.mongodb.net/";
const connectToMongo = () =>{
    mongoose.connect(mongoURI);
    console.log("Successfully connected to Mongo")
}

module.exports = connectToMongo;
