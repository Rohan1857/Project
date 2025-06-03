const mongoose = require('mongoose');
const testcaseSchema = new mongoose.Schema({
    ProblemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
        required: true
    },
    Input: {
        type: String,
        required: true
    },
    Output: {
        type: String,
        required: true
    },
   
});
module.exports = mongoose.model("Testcase", testcaseSchema);
