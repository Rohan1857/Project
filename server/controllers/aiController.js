const { GoogleGenAI } = require('@google/genai');
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

module.exports = {
    analyzeTimeComplexity,
    getHelpOnCode
};
