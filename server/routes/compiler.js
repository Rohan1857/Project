const express = require('express');
const router = express.Router();
const { authMiddleware, verifyAdmin } = require('../middleware/authMiddleware');
const axios = require('axios');

router.post("/run", authMiddleware, async (req, res) => {
    const { language, code, input = "" } = req.body;
    if (!code) {
        return res.status(404).json({ success: false, error: "Empty code!" });
    }
    console.log(language);
    try {
        const response = await axios.post('http://localhost:8000/run', {
            language,
            code,
            input
        });
        res.json(response.data);
    } catch (error) {
        console.error("Error in running code:", error.response?.data || error.message || error);
        res.status(500).json({ error: error.response?.data?.error || error.message || error });
    }
});

module.exports = router;