const express = require('express');
const { executeCode } = require('./executeCode');
const { generateFile } = require('./generateFile');
const app = express();
app.use(express.json());

app.post('/run', async (req, res) => {
  const { language, code, input = "" } = req.body;
  try {
    const filePath = await generateFile(language, code);
    const output = await executeCode(language, filePath, input);
    res.json({ output });
  } catch (error) {
    res.status(400).json({ error });
  }
});

// New /submit endpoint
app.post('/submit', async (req, res) => {
  const { language, code, inputs = [] } = req.body;
  try {
    // Generate file once for all testcases
    const filePath = await generateFile(language, code);
    const results = [];

    // Run the code for each input
    for (const input of inputs) {
      try {
        const output = await executeCode(language, filePath, input);
        
        console.log(`Input: ${input}, Output: ${output}`);
        results.push({  output });
      } catch (err) {
        results.push({ input, output: null, error: err.toString() });
      }
    }

    res.json({ results});
  } catch (error) {
    res.status(400).json({ error: error.toString() });
  }
});

app.listen(8000, () => console.log('Compiler service running on port 8000'));