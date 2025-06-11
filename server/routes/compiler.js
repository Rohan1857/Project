const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { runCode, submitCode } = require('../controllers/codeController');


router.post('/run', authMiddleware, runCode);
router.post('/submit', authMiddleware, submitCode);

module.exports = router;
