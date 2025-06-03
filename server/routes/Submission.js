const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/filterbyproblem', authMiddleware,async (req, res) => {
  const { problemId, userId } = req.query;
  const filter = {};
  if (problemId) filter.problemId = problemId;
  if (userId ) filter.userId = userId;
  try {
    const submissions = await Submission.find(filter).sort({ createdAt: -1 });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});
router.get('/filterbyuser', authMiddleware, async (req, res) => {
  console.log("Filter by user endpoint hit");
  const { userId } = req.query;
  try {
    const submissions = await Submission.find({ userId }).sort({ createdAt: -1 });
    res.json(submissions);
    console.log("Submissions found:", submissions);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
