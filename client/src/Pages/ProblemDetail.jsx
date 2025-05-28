import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import MonacoEditor from 'react-monaco-editor';
import 'monaco-editor/esm/vs/basic-languages/cpp/cpp.contribution';
import 'monaco-editor/esm/vs/basic-languages/java/java.contribution';
import 'monaco-editor/esm/vs/basic-languages/python/python.contribution';
const codeTemplates = {
  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    cout << "Hello World!";
    return 0;
}`,
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
}`,
  python: `print("Hello World!")`
};

const languageMap = {
  cpp: { name: 'C++', editor: 'cpp' },
  java: { name: 'Java', editor: 'java' },
  python: { name: 'Python', editor: 'python' },
};

function ProblemDetails() {
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add language state
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState(codeTemplates['cpp']);

  const [output, setOutput] = useState(null);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [inputExpanded, setInputExpanded] = useState(false);
  const [editorFullScreen, setEditorFullScreen] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/admin/problem/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setProblem(res.data);
      } catch {
        setError('Failed to fetch problem');
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [id]);

  // Update code template when language changes
  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    setCode(codeTemplates[lang]);
  };

  if (loading)
    return (
      <div className="h-screen bg-[#18191B] flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  if (error)
    return (
      <div className="h-screen bg-[#18191B] flex items-center justify-center">
        <div className="text-red-400 text-lg">{error}</div>
      </div>
    );
  if (!problem)
    return (
      <div className="h-screen bg-[#18191B] flex items-center justify-center">
        <div className="text-red-400 text-lg">Problem not found.</div>
      </div>
    );

  const handleRun = async () => {
    setOutput(null);
    setRunning(true);
    setShowOutput(false);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/compiler/run',
        {
          language,
          code,
          input: customInput,
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      setOutput(res.data.output || JSON.stringify(res.data, null, 2));
      setShowOutput(true);
    } catch (err) {
      setOutput(
        err.response?.data?.error || err.message || 'Error running code.'
      );
      setShowOutput(true);
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
  if(!code.trim()) {
    alert('Please write some code before submitting.');
    return;
  }
  setSubmitting(true);
  setOutput(null);
  setShowOutput(false);
  try {
    const token = localStorage.getItem('token');
    const res = await axios.post(
      'http://localhost:5000/api/compiler/submit',
      {
        problemId: id,
        language,
        code,
      },
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
    // Assuming the backend returns a result/verdict
    if (res.data.verdict) {
    if (res.data.verdict === "Solution Accepted") {
        setOutput("Solution Accepted");
    } else if (res.data.verdict === "Runtime Error") {
        setOutput("Runtime Error");}
        else {
        setOutput(`Verdict: ${res.data.verdict}\nInput: ${res.data.input}\nExpected: ${res.data.expectedOutput}\nOutput: ${res.data.output}`);
    }
} else {
    setOutput(res.data || JSON.stringify(res.data, null, 2));
}
    setShowOutput(true);
  } catch (err) {
    setOutput(
      err.response?.data?.error || err.message || 'Error submitting code.'
    );
    setShowOutput(true);
  } finally {
    setSubmitting(false);
  }
};


  const handleCloseOutput = () => setShowOutput(false);

  return (
    <div className={`h-screen bg-[#18191B] flex flex-col overflow-hidden`}>
      <div className={`flex-1 flex min-h-0 ${editorFullScreen ? '' : ''}`}>
        {!editorFullScreen && (
          // Left: Problem Details
          <div className="w-1/2 bg-[#18191B] p-6 overflow-y-auto border-r border-gray-700">
            <div className="max-w-full">
              <div className="flex items-center gap-4 mb-6">
                <h1 className="text-3xl font-bold text-white">{problem.Title}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${
                  problem.Difficulty?.toLowerCase() === 'easy' ? 'bg-green-500' :
                  problem.Difficulty?.toLowerCase() === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                }`}>
                  {problem.Difficulty}
                </span>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-white mb-2">Problem Statement</h2>
                  <div className="text-gray-300 whitespace-pre-line">{problem.ProblemStatement}</div>
                </div>
                
                <div>
                  <h2 className="text-lg font-semibold text-white mb-2">Sample Input</h2>
                  <pre className="bg-[#222326] text-gray-300 p-4 rounded-lg overflow-x-auto font-mono">
                    {problem.SampleInput}
                  </pre>
                </div>
                
                <div>
                  <h2 className="text-lg font-semibold text-white mb-2">Sample Output</h2>
                  <pre className="bg-[#222326] text-gray-300 p-4 rounded-lg overflow-x-auto font-mono">
                    {problem.SampleOutput}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Right: Monaco Editor */}
        <div className={`${editorFullScreen ? 'w-full h-full fixed inset-0 z-50 bg-[#1e1e1e] flex flex-col' : 'w-1/2 bg-[#1e1e1e] flex flex-col'}`}>
          {/* Language Selection Dropdown */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
            <div>
              <label htmlFor="language" className="text-gray-300 text-sm mr-2">Language:</label>
              <select
                id="language"
                value={language}
                onChange={handleLanguageChange}
                className="bg-[#23272f] text-gray-200 px-2 py-1 rounded border border-gray-600 focus:outline-none"
                disabled={running}
              >
                {Object.keys(languageMap).map((lang) => (
                  <option key={lang} value={lang}>{languageMap[lang].name}</option>
                ))}
              </select>
            </div>
            {/* Fullscreen toggle button */}
            <button
              className="bg-gray-700 text-gray-200 px-3 py-1 rounded hover:bg-gray-600 text-sm"
              onClick={() => setEditorFullScreen(fs => !fs)}
            >
              {editorFullScreen ? 'Exit Full Screen' : 'Full Screen'}
            </button>
          </div>
          {/* Monaco Editor with top padding */}
          <div className="flex-1 min-h-0 pt-4">
            <MonacoEditor
              width="100%"
              height="100%"
              language={languageMap[language].editor}
              theme="vs-dark"
              value={code}
              onChange={setCode}
              options={{
                selectOnLineNumbers: true,
                automaticLayout: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: 'on',
              }}
            />
          </div>

          {/* Show input/footer only if not full screen */}
          {!editorFullScreen && (
            <>
              {/* Custom Input Section */}
              <div className="border-t border-gray-600">
                {!inputExpanded && (
                  <button
                    className="w-full py-3 bg-[#23272f] text-gray-300 hover:bg-[#2a2f38] transition-colors flex items-center justify-center gap-2"
                    onClick={() => setInputExpanded(true)}
                  >
                    <span>▼</span>
                    Custom Input
                  </button>
                )}
                {inputExpanded && (
                  <div className="bg-[#23272f] p-4">
                    <textarea
                      className="w-full h-20 bg-[#18191B] text-gray-300 p-3 rounded border border-gray-600 focus:border-green-500 focus:outline-none font-mono resize-none"
                      placeholder="Enter custom input here..."
                      value={customInput}
                      onChange={e => setCustomInput(e.target.value)}
                    />
                    <button
                      className="mt-2 w-full py-2 bg-[#23272f] text-gray-300 hover:bg-[#2a2f38] transition-colors flex items-center justify-center gap-2"
                      onClick={() => setInputExpanded(false)}
                    >
                      <span>▲</span>
                      Hide Input
                    </button>
                  </div>
                )}
              </div>
              {/* Footer */}
              <div className="bg-[#18191B] p-4 border-t border-gray-600">
                <div className="flex justify-end gap-4">
                  <button 
                    className="px-6 py-2 bg-[#23272f] text-gray-300 rounded hover:bg-[#2a2f38] transition-colors disabled:opacity-50" 
                    onClick={handleRun} 
                    disabled={running}
                  >
                    {running ? 'Running...' : 'Run'}
                  </button>
                  <button 
                    className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors" 
                    onClick={handleSubmit}
                    disabled={submitting}
                  >

                    {submitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Output Panel */}
      <div className={`fixed left-4 bottom-0 transform transition-transform duration-300 ${
        showOutput ? 'translate-y-0' : 'translate-y-full'
      } bg-[#1b1f27] text-gray-300 rounded-t-lg shadow-2xl max-w-md min-w-80 z-50`}>
        <div className="flex justify-between items-center p-4 border-b border-gray-600">
          <span className="font-semibold">Output</span>
          <button 
            className="text-gray-400 hover:text-white text-xl leading-none"
            onClick={handleCloseOutput}
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
    </div>
  );
}

export default ProblemDetails;