const express = require('express');
const router = express.Router();
const Notes = require('../models/Notes');
const fetchuser = require("../middleware/fetchuser");
const {body, validationResult} = require("express-validator");

// Fetching all notes using get : api/notes/fetchallnotes 
router.get("/fetchallnotes", fetchuser , async (req,res) => {
    const notes = await Notes.find({user:req.user.id});
    res.json(notes);
});

// Adding a note using Post api/notes/addnote  
router.post("/addnote", fetchuser, [
    body('title', "Enter a valid name").isLength({min: 1}),
    body('description', "description must be at least 5 characters").isLength({min:5}),
] , async (req,res) => {
    try {
        const {title , description, tag} = req.body;
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors : errors.array()});
        }
        const note = new Notes({
            title, description, tag, user : req.user.id
        });
        const savedNotes = await note.save();
        res.json(savedNotes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occured");
    }
});


// Adding a note using Put api/notes/updatenote  
router.put("/updatenote/:id", fetchuser, async (req,res) => {
    const {title, description, tag} = req.body;
    const newNote = {};
    if(title){newNote.title = title};
    if(description){newNote.description = description};
    if(tag){newNote.tag = tag};

    let note =await Notes.findById(req.params.id);
    if(!note){return res.status(404).send("Not found")}

    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed");
    }
     
    note = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true});
    res.json({note})
});


// Adding a note using Put api/notes/deletenote  
router.delete("/deletenote/:id", fetchuser, async (req,res) => {
    const {title, description, tag} = req.body;
    const newNote = {};
    if(title){newNote.title = title};
    if(description){newNote.description = description};
    if(tag){newNote.tag = tag};

    let note =await Notes.findById(req.params.id);
    if(!note){return res.status(404).send("Not found")}

    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed");
    }
     
    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({"Success":"Note deleted",note:note})
});
module.exports = router;