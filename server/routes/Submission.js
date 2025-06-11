const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  filterByProblem,
  filterByUser
} = require('../controllers/submissionController');

router.get('/filterbyproblem', authMiddleware, filterByProblem);
router.get('/filterbyuser', authMiddleware, filterByUser);

module.exports = router;
