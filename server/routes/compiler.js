const express = require('express');
const router = express.Router();
const { generateFile } = require('../compiler/generateFile');
const { executeCpp } = require('../compiler/executeCpp');
const {authMiddleware,verifyAdmin} = require('../middleware/authMiddleware');
router.get("/getcode", authMiddleware, (req, res) => {
    res.json({ online: 'compiler' });
});

router.post("/run", authMiddleware ,async (req, res) => {
    const { language = 'cpp', code } = req.body;
    if (!code) {
        return res.status(404).json({ success: false, error: "Empty code!" });
    }
    try {
        const filePath = await generateFile(language, code);
        const output = await executeCpp(filePath);
        res.json({ filePath, output });
    } catch (error) {
        res.status(500).json({ error: error.message || error });
    }
});

module.exports = router;