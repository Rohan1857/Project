import { useEffect } from 'react';

function OutputPanel({ showOutput, output, onClose }) {
  // Reset logic if needed in the future
  useEffect(() => {
    // Placeholder: You can reset any state here if you add back features
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
      </pre>
    </div>
  );
}

export default OutputPanel;
