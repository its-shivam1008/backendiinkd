require("dotenv").config();
const connectToMongo =require('./db');
const express = require('express');
var cors = require('cors');

connectToMongo();

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());



app.use('/api/auth', require("./routes/auth"));
app.use('/api/notes', require("./routes/notes"));
app.use('/app', function(req,res){
    res.send("hellow");
})

app.listen(process.env.PORT,() => {
    console.log(`example app listening at http://localhost:${port}`);
});
