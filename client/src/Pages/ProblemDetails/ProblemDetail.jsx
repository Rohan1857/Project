import { useState } from 'react';
import { useParams } from 'react-router-dom';
import MonacoCodeEditor from './Components/MonacoCodeEditor';
import OutputPanel from './Components/OutputPanel';
import LanguageSelector from './Components/LanguageSelector';
import CustomInput from './Components/CustomInput';
import { useProblem } from './hooks/useProblem';
import { runCode, submitCode } from './api/problemApi';
import SubmissionsPanel from './Components/SubmissionPanel'; // <-- Fix import name
import { useAuth } from '../../hooks/useAuth';

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
  const { id } = useParams();
  const { problem, loading, error } = useProblem(id);
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState(codeTemplates['cpp']);
  const [output, setOutput] = useState(null);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [inputExpanded, setInputExpanded] = useState(false);
  const [editorFullScreen, setEditorFullScreen] = useState(false);
  const [solutionAccepted, setSolutionAccepted] = useState(false);
  const [verdictOutput, setVerdictOutput] = useState('');
  const [activeTab, setActiveTab] = useState('Description');

  const { user } = useAuth();
  const userId = user ? (user._id || user.id) : null; // Support both _id and id

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(codeTemplates[lang]);
  };

  const handleRun = async () => {
    setOutput(null);
    setRunning(true);
    setShowOutput(false);
    try {
      const res = await runCode(language, code, customInput);
      setOutput(res.output || JSON.stringify(res, null, 2));
      setShowOutput(true);
    } catch (err) {
      setOutput(err.message || 'Error running code.');
      setShowOutput(true);
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      alert('Please write some code before submitting.');
      return;
    }
    setSubmitting(true);
    setOutput(null);
    setShowOutput(false);
    setSolutionAccepted(false);

    try {
      const res = await submitCode(id, language, code);

      let verdict = '';
      if (res.verdict === "Solution Accepted") {
        verdict = "Solution Accepted\n";
        setSolutionAccepted(true);
      } else if (res.verdict === "Runtime Error") {
        verdict = "Runtime Error";
      } else {
        verdict = `Verdict: ${res.verdict}\nInput: ${res.input}\nExpected: ${res.expectedOutput}\nOutput: ${res.output}`;
      }

      setVerdictOutput(verdict);
      setOutput(verdict);
      setShowOutput(true);
    } catch (err) {
      setOutput(err.message || 'Error submitting code.');
      setShowOutput(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="h-screen bg-[#18191B] flex items-center justify-center"><div className="text-white text-lg">Loading...</div></div>;
  if (error) return <div className="h-screen bg-[#18191B] flex items-center justify-center"><div className="text-red-400 text-lg">{error}</div></div>;
  if (!problem) return <div className="h-screen bg-[#18191B] flex items-center justify-center"><div className="text-red-400 text-lg">Problem not found.</div></div>;

  return (
    <div className={`h-screen bg-[#18191B] flex flex-col overflow-hidden`}>
      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-700 bg-[#18191B] px-6">
        {['Description', 'Submissions'].map(tab => (
          <button
            key={tab}
            className={`py-3 px-2 text-sm font-semibold border-b-2 transition ${
              activeTab === tab
                ? 'border-blue-400 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 flex min-h-0">
        {/* Left: Description or Submissions */}
        <div className="w-1/2 bg-[#18191B] p-0 overflow-y-auto border-r border-gray-700">
          {activeTab === 'Description' && (
            <div className="p-6 max-w-full">
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
          )}
          {activeTab === 'Submissions' && (
            <div className="h-full">
              <SubmissionsPanel problemId={id} userId={userId} />
            </div>
          )}
        </div>

        {/* Right: Code Editor and Output */}
        <div className={`${editorFullScreen ? 'w-full h-full fixed inset-0 z-50 bg-[#1e1e1e] flex flex-col' : 'w-1/2 bg-[#1e1e1e] flex flex-col'}`}>
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
            <LanguageSelector
              language={language}
              languageMap={languageMap}
              disabled={running}
              onChange={handleLanguageChange}
            />
            <button
              className="bg-gray-700 text-gray-200 px-3 py-1 rounded hover:bg-gray-600 text-sm"
              onClick={() => setEditorFullScreen(fs => !fs)}
            >
              {editorFullScreen ? 'Exit Full Screen' : 'Full Screen'}
            </button>
          </div>
          <div className="flex-1 min-h-0 pt-4">
            <MonacoCodeEditor
              language={languageMap[language].editor}
              code={code}
              setCode={setCode}
            />
          </div>
          {!editorFullScreen && (
            <>
              <CustomInput
                inputExpanded={inputExpanded}
                setInputExpanded={setInputExpanded}
                customInput={customInput}
                setCustomInput={setCustomInput}
              />
              <div className="bg-[#18191B] p-4 border-t border-gray-600">
                <div className="flex justify-end gap-4">
                  <button className="px-6 py-2 bg-[#23272f] text-gray-300 rounded hover:bg-[#2a2f38] transition-colors disabled:opacity-50"
                    onClick={handleRun}
                    disabled={running}
                  >
                    {running ? 'Running...' : 'Run'}
                  </button>
                  <button className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
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
      <OutputPanel
        showOutput={showOutput}
        output={output}
        onClose={() => setShowOutput(false)}
        code={code}
      />
    </div>
  );
}

export default ProblemDetails;