const express = require('express');
const router = express.Router();
const { authMiddleware, verifyAdmin } = require('../middleware/authMiddleware');
const axios = require('axios');

const path = require('path');
const fs = require('fs').promises;
const Submission = require('../models/Submission');

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

router.post("/submit", authMiddleware, async (req, res) => {
    const { language, code, problemId } = req.body;
    if (!code) {
        return res.status(404).json({ success: false, error: "Empty code!" });
    }

    // 1. Build testcase paths
    const baseDir = path.join("D:/OJ/Testcases", String(problemId));
    const inputDir = path.join(baseDir, "input");
    const outputDir = path.join(baseDir, "output");

    try {
        // 2. List input files
        const inputFiles = (await fs.readdir(inputDir))
            .filter(f => /^input\d+\.txt$/.test(f))
            .sort((a, b) => {
                // Sort numerically by index (input1.txt, input2.txt, ...)
                const getNum = s => parseInt(s.match(/\d+/)[0]);
                return getNum(a) - getNum(b);
            });

        if (!inputFiles.length) {
            return res.status(404).json({ success: false, error: "No testcases found for this problem." });
        }

        // 3. Read all inputs and outputs
        const inputs = [];
        const expectedOutputs = [];
        const testcaseIds = []; // use file index as id

        for (const inputFile of inputFiles) {
            const idx = inputFile.match(/\d+/)[0];
            const outputFile = `output${idx}.txt`;

            const input = await fs.readFile(path.join(inputDir, inputFile), 'utf-8');
            const expectedOutput = await fs.readFile(path.join(outputDir, outputFile), 'utf-8');

            inputs.push(input);
            expectedOutputs.push(expectedOutput);
            testcaseIds.push(idx);
        }

       // 4. Send all inputs to compiler service
       const response = await axios.post('http://localhost:8000/submit', {
            language,
            code,
            inputs
        });

        // 5. Compare outputs and find first failure
        const allResults = [];
        const outputs = response.data.results;
        console.log("Outputs received from compiler service:", outputs);
        
        let firstFailure = null;
        let allPassed = true;

        for (let i = 0; i < outputs.length; i++) {
            // Handle null/undefined outputs gracefully and extract output property from objects
            let actualOutput = '';
            if (outputs[i] != null) {
                if (typeof outputs[i] === 'object' && outputs[i].output !== undefined) {
                    // Extract the output property from the object
                    actualOutput = String(outputs[i].output).trim();
                } else if (typeof outputs[i] === 'object') {
                    // If it's an object without output property, stringify it
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
            
            // Store first failure for response
            if (!passed && !firstFailure) {
                firstFailure = result;
                allPassed = false;
            }
        }

        console.log("Test results:", allResults);
console.log("First failure:", firstFailure.actualOutput, firstFailure.expectedOutput);
        // 6. Prepare response based on results
        let responseData;
        if(firstFailure.actualOutput == 'null') {
            responseData = {
                verdict: "Runtime Error",
            };
            console.log("Runtime Error detected");
        }
       else if (allPassed ) {
            responseData = {
               
                verdict: "Solution Accepted"
            };
        } else  {
            responseData = {
               
                verdict: "Wrong Answer",
                input: inputs[allResults.findIndex(r => !r.passed)],
                expectedOutput: firstFailure.expectedOutput,
                output: firstFailure.actualOutput
            };
        }
res.status(200).json(responseData);
        // 7. Save submission
        const newSubmission = new Submission({
            userId: req.user.id,
            problemId,
            language,
            code,
            verdict: responseData.verdict,
            input: inputs[allResults.findIndex(r => !r.passed)],
                expectedOutput: firstFailure.expectedOutput,
                output: firstFailure.actualOutput
        });
        await newSubmission.save();
        console.log("Submission saved successfully");

    } catch (error) {
        console.error("Error in submission:", error);
        res.status(500).json({ error: error.response?.data?.error || error.message || error });
    }
});

module.exports = router;