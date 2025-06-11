const Problem = require('../models/Problem');
const Testcase = require('../models/Testcase');

exports.addProblem = async (req, res) => {
  try {
    const { Title, ProblemStatement, SampleInput, SampleOutput, Difficulty, testcases } = req.body;
    if (!Title || !ProblemStatement || !SampleInput || !SampleOutput || !Difficulty)
      return res.status(400).json({ message: 'All fields are required' });

    if (!Array.isArray(testcases) || testcases.length !== 10)
      return res.status(400).json({ message: '10 testcases required' });

    const createdProblem = await Problem.create({
      Title,
      ProblemStatement,
      SampleInput,
      SampleOutput,
      Difficulty,
    });

    const testcaseDocs = testcases.map(tc => ({
      ProblemId: createdProblem._id,
      Input: tc.Input,
      Output: tc.Output,
    }));

    await Testcase.insertMany(testcaseDocs);

    return res.status(200).json({ message: 'Problem and testcases added successfully' });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find();
    return res.status(200).json(problems);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getProblemById = async (req, res) => {
  const { id } = req.params;
  try {
    const problemData = await Problem.findById(id);
    if (!problemData) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    return res.status(200).json(problemData);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteProblem = async (req, res) => {
  const { id } = req.body;
  try {
    const deletedProblem = await Problem.findByIdAndDelete(id);
    if (!deletedProblem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    return res.status(200).json({ message: 'Problem deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};
