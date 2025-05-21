const mongoose = require('mongoose');
const problemSchema = new mongoose.Schema({
    Title : { type : String, required : true},
ProblemStatement : { type : String, required : true},

SampleInput : { type : String, required : true},
SampleOutput : { type : String, required : true},
Difficulty : { type : String, default : "Easy"},
})
module.exports = mongoose.model("Problem",problemSchema);