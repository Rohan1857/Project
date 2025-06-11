const express = require('express');
const router = express.Router();
const { authMiddleware, verifyAdmin } = require('../middleware/authMiddleware');
const {
  addProblem,
  getAllProblems,
  getProblemById,
  deleteProblem
} = require('../controllers/problemController');

router.post('/AddProblem', authMiddleware, verifyAdmin, addProblem);
router.get('/Problems', authMiddleware, getAllProblems);
router.get('/problem/:id', authMiddleware, getProblemById);
router.delete('/deleteProblem/:id', authMiddleware, verifyAdmin, deleteProblem); 

module.exports = router;
