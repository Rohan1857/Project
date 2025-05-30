const mongoose = require('mongoose');
const submissionSchema = new mongoose.Schema({
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  code: { type: String, required: true },
  verdict: { type: String, required: true, default: 'Pending' },
  language: { type: String, required: true },
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true },
  output: { type: String, required: true },
}, { timestamps: true });
module.exports = mongoose.model("Submission", submissionSchema);