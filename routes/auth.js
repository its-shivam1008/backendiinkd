const express = require('express');
const User = require('../models/User');
const router = express.Router();
const {body, validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const JWT_secret = "heyitsShiv@m$huklA";


// Authenticate a user using Post: "api/aut/createuser". No login required
router.post("/createuser", [
    body('name', "Name is too short. Enter a valid name").isLength({min: 3}),
    body('email', "Enter a valid email").isEmail(),
    body('password', "Password must be atleast 5 characters").isLength({min:5}),
] ,async (req,res) => {
    // const user =User(req.body);
    // user.save();
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()});
    }
    // res.send(req.body); res 1 hi baar jata hai 
    try {
    
    let user = await User.findOne({email: req.body.email});
    if(user){
        return res.status(400).json({error: "Sorry a user with this email already exits."});
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password,salt);
    user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
    })
    const data = {
        user:{
            id: user.id
        }
    }

    const authToken = jwt.sign(data, JWT_secret);
    // .then(user => res.json(user)).catch(erro => {console.log(erro);
    // res.json({error: "Please enter a valid email"})}) // yaha par res 1 baar bhej chuke hai 
    res.json({authToken});
        
    } catch (error) {
            console.error(error.message);
            res.status(500).send("Some error occured");
    }
});


// Authenticate a user using Post: "api/aut/login". No login required
router.post("/login", [
    body('email', "Enter a valid email").isEmail(),
    body('password', "Password cannot be blank").exists(),
] ,async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()});
    }
    const {email,password} = req.body;
    try {
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({error: "Please enter correct credentials."});
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            return res.status(400).json({error: "Please enter correct credentials."});
        }
        const data = {
            user:{
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_secret);
        res.json({authToken});
        
    } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server error.");
    }
});


// get logged-in user detail using POST "/api/auth/getuser". Login required
router.post("/getuser", fetchuser ,async (req,res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error.")
    }
});
module.exports = router;