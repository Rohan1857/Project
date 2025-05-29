const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
require('dotenv').config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function analyzeTimeComplexity(code) {
    try {
        const prompt = `Analyze the time complexity of the following code in Big-O notation. Only return the Big-O expression, no explanation.\n\n${code}`;
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [{ parts: [{ text: prompt }] }],
        });
        const resultText = response.text?.trim();
        return resultText || 'Analysis not available';
    } catch (err) {
        console.error("Gemini analysis failed:", err.message);
        return 'Error analyzing time complexity';
    }
}

async function getHelpOnCode({ code, input, expectedOutput, output }) {
    try {
        // Compose a focused prompt with all available details
       const prompt = [
    `A user wrote the following code:\n${code}`,
    input ? `\n\nInput:\n${input}` : '',
    expectedOutput ? `\n\nExpected Output:\n${expectedOutput}` : '',
    output ? `\n\nActual Output or Error:\n${output}` : '',
    `\n\nBased on this information, provide only logical, concise hints to help the user debug their code. Do not provide any code or step-by-step code changes. Do not explain the code itself. Focus only on possible logical mistakes or overlooked cases. Keep your response short and actionable.`
].join('');
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [{ parts: [{ text: prompt }] }],
        });
        const help = response.text?.trim();
        return help || 'No help available.';
    } catch (err) {
        console.error("Gemini help failed:", err.message);
        return 'Error generating help.';
    }
}

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

// Help endpoint for output panel "Get Help"
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