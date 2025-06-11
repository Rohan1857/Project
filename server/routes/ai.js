const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { analyzeTimeComplexity, getHelpOnCode } = require('../controllers/aicontroller');


router.post('/analyze', authMiddleware, async (req, res) => {
    const { code } = req.body;
    if (!code) {
        return res.status(400).json({ success: false, error: "Code is required for analysis." });
    }
    try {
        const analysis = await analyzeTimeComplexity(code);
        return res.status(200).json({ success: true, time_complexity: analysis, analysis });
    } catch (error) {
        console.error("AI Analysis Error:", error);
        return res.status(500).json({ success: false, error: "Failed to analyze code." });
    }
});


router.post('/help', authMiddleware, async (req, res) => {
    const { code, input, expectedOutput, output } = req.body;
    if (!code) {
        return res.status(400).json({ success: false, help: "Code is required for help." });
    }
    try {
        const help = await getHelpOnCode({ code, input, expectedOutput, output });
        return res.status(200).json({ success: true, help });
    } catch (error) {
        console.error("AI Help Error:", error);
        return res.status(500).json({ success: false, help: "Failed to generate help." });
    }
});

module.exports = router;
