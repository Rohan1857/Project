const Submission = require('../models/Submission');

exports.filterByProblem = async (req, res) => {
  const { problemId, userId } = req.query;
  const filter = {};
  if (problemId) filter.problemId = problemId;
  if (userId) filter.userId = userId;

  try {
    const submissions = await Submission.find(filter).sort({ createdAt: -1 });
    res.json(submissions);
  } catch (err) {
    console.error("Error fetching submissions by problem/user:", err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.filterByUser = async (req, res) => {
  const { userId } = req.query;
  try {
    const submissions = await Submission.find({ userId }).sort({ createdAt: -1 });
    res.json(submissions);
  } catch (err) {
    console.error("Error fetching submissions by user:", err);
    res.status(500).json({ error: 'Server error' });
  }
};
