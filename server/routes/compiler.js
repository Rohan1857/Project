const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const axios = require('axios');
require('dotenv').config();
const Submission = require('../models/Submission');
const Testcase = require('../models/Testcase'); // Import the Testcase model

router.post("/run", authMiddleware, async (req, res) => {
    const { language, code, input = "" } = req.body;
    if (!code) {
        return res.status(404).json({ success: false, error: "Empty code!" });
    }
    try {
        const response = await axios.post(process.env.run_url, {
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

router.post("/submit", authMiddleware, async (req, res) => {
    const { language, code, problemId } = req.body;
    if (!code) {
        return res.status(404).json({ success: false, error: "Empty code!" });
    }

    try {
        // Fetch testcases from MongoDB
        const testcases = await Testcase.find({ ProblemId: problemId }).sort({ _id: 1 }).lean();
        if (!testcases.length) {
            return res.status(404).json({ success: false, error: "No testcases found." });
        }
console.log("Testcases fetched:", testcases);
        const inputs = testcases.map(tc => tc.Input);
        const expectedOutputs = testcases.map(tc => tc.Output);
        const testcaseIds = testcases.map((tc, idx) => (idx + 1).toString());

        const response = await axios.post(process.env.submit_url, {
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
                verdict: "Solution Accepted"
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
            input: responseData.input || "Runtime Error",
            expectedOutput: responseData.expectedOutput || "Runtime Error",
            output: responseData.output || "Runtime Error"
        });
        await newSubmission.save();

        console.log("Submission saved successfully");

    } catch (error) {
        console.error("Error in submission:", error);
        res.status(500).json({ error: error.response?.data?.error || error.message || error });
    }
});

module.exports = router;