import { useState, useEffect } from 'react';
import axios from 'axios';

function OutputPanel({ showOutput, output, onClose, code }) {
  const [complexity, setComplexity] = useState(null);
  const [loading, setLoading] = useState(false);

  const [helpText, setHelpText] = useState(null);
  const [helpLoading, setHelpLoading] = useState(false);

  // Reset help and complexity state when output changes (i.e. after a new run/submit)
  useEffect(() => {
    setHelpText(null);
    setHelpLoading(false);
    setComplexity(null);
    setLoading(false);
  }, [output]);

  // Parse verdict, input, expected and output from the output string
  let verdict = "";
  let input = "";
  let expectedOutput = "";
  let actualOutput = "";

  if (typeof output === "string" && output.trim() !== "") {
    const lines = output.split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("Verdict:")) verdict = lines[i].replace("Verdict:", "").trim();
      if (lines[i].startsWith("Input:")) input = lines[i].replace("Input:", "").trim();
      if (lines[i].startsWith("Expected:")) expectedOutput = lines[i].replace("Expected:", "").trim();
      if (lines[i].startsWith("Output:")) actualOutput = lines[i].replace("Output:", "").trim();
      if (lines[i].startsWith("Runtime Error")) verdict = "Runtime Error";
    }
  }

  const handleAnalyze = async () => {
    try {
      setLoading(true);
      setComplexity(null);
      const res = await axios.post(
        'http://localhost:5000/api/ai/analyze',
        { code },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setComplexity(res.data.analysis || 'No complexity info found.');
    } catch (err) {
      setComplexity('Failed to analyze complexity.');
    } finally {
      setLoading(false);
    }
  };

  const handleHelp = async () => {
    try {
      setHelpLoading(true);
      setHelpText(null);
      const res = await axios.post(
        'http://localhost:5000/api/ai/help',
        {
          code,
          input,
          expectedOutput,
          output: actualOutput,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setHelpText(res.data.help || 'No help info found.');
    } catch (err) {
      setHelpText('Failed to get help.');
    } finally {
      setHelpLoading(false);
    }
  };

  // Show help link whenever solution is NOT accepted and there's an output
  const showHelpLink =
    (typeof output === 'string') &&
    output.trim() !== '' &&
    !output.includes('Solution Accepted');

  return (
    <div className={`fixed left-4 bottom-0 transform transition-transform duration-300 ${
      showOutput ? 'translate-y-0' : 'translate-y-full'
    } bg-[#1b1f27] text-gray-300 rounded-t-lg shadow-2xl max-w-md min-w-80 z-50`}>
      <div className="flex justify-between items-center p-4 border-b border-gray-600">
        <span className="font-semibold">Output</span>
        <button 
          className="text-gray-400 hover:text-white text-xl leading-none"
          onClick={onClose}
        >
          ×
        </button>
      </div>
      <pre className="p-4 max-h-60 overflow-auto whitespace-pre-wrap font-mono text-sm">
        {output === null
          ? 'Run your code to see output here.'
          : (typeof output === 'object'
              ? (output.output || output.error || JSON.stringify(output, null, 2))
              : output)
        }

        {output?.includes("Solution Accepted") && (
          <div className="mt-4">
            {!complexity && !loading && (
              <button
                className="text-blue-400 hover:underline cursor-pointer mt-2 bg-transparent border-none p-0"
                onClick={handleAnalyze}
                style={{ textDecoration: 'underline' }}
                type="button"
              >
                Analyze Complexity
              </button>
            )}
            {loading && (
              <div className="mt-2 flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-yellow-300" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
                </svg>
                <span className="text-yellow-300">Analyzing...</span>
              </div>
            )}
            {complexity && (
              <div className="text-blue-300 mt-2">
                Time Complexity: <br />{complexity}
              </div>
            )}
          </div>
        )}

        {showHelpLink && (
          <div className="mt-4">
            {!helpText && !helpLoading && (
              <button
                className="text-blue-400 hover:underline cursor-pointer mt-2 bg-transparent border-none p-0"
                onClick={handleHelp}
                style={{ textDecoration: 'underline' }}
                type="button"
              >
                Get Help
              </button>
            )}
            {helpLoading && (
              <div className="mt-2 flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-yellow-300" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
                </svg>
                <span className="text-yellow-300">Getting help...</span>
              </div>
            )}
            {helpText && (
              <div className="text-blue-300 mt-2">
                Help: <br />{helpText}
              </div>
            )}
          </div>
        )}
      </pre>
    </div>
  );
}

export default OutputPanel;