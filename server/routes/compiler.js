const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const axios = require('axios');
require('dotenv').config();
const path = require('path');
const fs = require('fs').promises;
const Submission = require('../models/Submission');

// Helper function to analyze time complexity using Gemini


router.post("/submit", authMiddleware, async (req, res) => {
    const { language, code, problemId } = req.body;
    if (!code) {
        return res.status(404).json({ success: false, error: "Empty code!" });
    }

    const baseDir = path.join("D:/OJ/Testcases", String(problemId));
    const inputDir = path.join(baseDir, "input");
    const outputDir = path.join(baseDir, "output");

    try {
        const inputFiles = (await fs.readdir(inputDir))
            .filter(f => /^input\d+\.txt$/.test(f))
            .sort((a, b) => {
                const getNum = s => parseInt(s.match(/\d+/)[0]);
                return getNum(a) - getNum(b);
            });

        if (!inputFiles.length) {
            return res.status(404).json({ success: false, error: "No testcases found." });
        }

        const inputs = [], expectedOutputs = [], testcaseIds = [];

        for (const inputFile of inputFiles) {
            const idx = inputFile.match(/\d+/)[0];
            const outputFile = `output${idx}.txt`;

            const input = await fs.readFile(path.join(inputDir, inputFile), 'utf-8');
            const expectedOutput = await fs.readFile(path.join(outputDir, outputFile), 'utf-8');

            inputs.push(input);
            expectedOutputs.push(expectedOutput);
            testcaseIds.push(idx);
        }

        const response = await axios.post('http://localhost:8000/submit', {
            language,
            code,
            inputs
        });

        const outputs = response.data.results;
        const allResults = [];
        let firstFailure = null;
        let allPassed = true;

        for (let i = 0; i < outputs.length; i++) {
            let actualOutput = '';
            if (outputs[i] != null) {
                if (typeof outputs[i] === 'object' && outputs[i].output !== undefined) {
                    actualOutput = String(outputs[i].output).trim();
                } else if (typeof outputs[i] === 'object') {
                    actualOutput = JSON.stringify(outputs[i]).trim();
                } else {
                    actualOutput = String(outputs[i]).trim();
                }
            }

            const expectedOutput = expectedOutputs[i] != null ? String(expectedOutputs[i]).trim() : '';
            const passed = actualOutput === expectedOutput;

            const result = {
                testcaseId: testcaseIds[i],
                passed,
                expectedOutput,
                actualOutput
            };

            allResults.push(result);

            if (!passed && !firstFailure) {
                firstFailure = result;
                allPassed = false;
            }
        }

        let responseData;
        if (firstFailure?.actualOutput === 'null') {
            responseData = { verdict: "Runtime Error" };
        } else if (allPassed) {
            
           
            responseData = {
                verdict: "Solution Accepted",
                
            };
        } else {
            responseData = {
                verdict: "Wrong Answer",
                input: inputs[allResults.findIndex(r => !r.passed)],
                expectedOutput: firstFailure.expectedOutput,
                output: firstFailure.actualOutput
            };
        }

        // Respond first
        res.status(200).json(responseData);

        // Save submission in DB
        const newSubmission = new Submission({
            userId: req.user.id,
            problemId,
            language,
            code,
            verdict: responseData.verdict,
            input: responseData.input || "All test cases passed",
            expectedOutput: responseData.expectedOutput || "All test cases passed",
            output: responseData.output || "All test cases passed"
        });
        await newSubmission.save();

        console.log("Submission saved successfully");

    } catch (error) {
        console.error("Error in submission:", error);
        res.status(500).json({ error: error.response?.data?.error || error.message || error });
    }
});

module.exports = router;
