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

app.listen(8000, () => console.log('Compiler service running on port 8000'));