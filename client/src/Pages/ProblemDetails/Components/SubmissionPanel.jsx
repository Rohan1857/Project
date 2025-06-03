import React, { useEffect, useState } from 'react';
import axios from 'axios';

const getVerdictColor = (verdict) => {
  if (verdict === "Solution Accepted" || verdict === "Accepted")
    return "text-green-400";
  return "text-red-400";
};

export default function SubmissionsPanel({ problemId, userId }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [complexityResults, setComplexityResults] = useState({});
  const [loadingComplexityIndex, setLoadingComplexityIndex] = useState(null);

  useEffect(() => {
    if (!problemId || !userId) return;
    setLoading(true);
    const token = localStorage.getItem('token');
    axios.get(
      `http://localhost:5000/api/submission/filterbyproblem?problemId=${problemId}&userId=${userId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((res) => setSubmissions(res.data))
      .catch(() => setSubmissions([]))
      .finally(() => setLoading(false));
  }, [problemId, userId]);

  const handleAnalyze = async (code, idx) => {
    setLoadingComplexityIndex(idx);
    try {
      const res = await axios.post(
        'http://localhost:5000/api/ai/analyze',
        { code },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setComplexityResults((prev) => ({
        ...prev,
        [idx]: res.data.analysis || 'No complexity info found.'
      }));
    } catch (err) {
      setComplexityResults((prev) => ({
        ...prev,
        [idx]: 'Failed to analyze complexity.'
      }));
    } finally {
      setLoadingComplexityIndex(null);
    }
  };

  if (loading) return <div className="text-white p-4">Loading...</div>;
  if (!submissions.length) return <div className="text-gray-400 p-4">No submissions yet.</div>;

  return (
    <div className="bg-[#18191B] h-full px-4 pt-2 w-full">
      <div className="flex text-xs font-semibold text-gray-300 border-b border-[#313236] pb-2 select-none">
        <div className="w-12">#</div>
        <div className="flex-1">Status</div>
        <div className="w-20">Language</div>
        <div className="w-16"></div>
      </div>

      <div className="overflow-y-auto">
        {submissions.map((sub, idx) => (
          <React.Fragment key={sub._id}>
            <div
              className={`flex items-center text-sm border-b border-[#232326] cursor-pointer hover:bg-[#23272f] transition ${selectedIndex === idx ? 'bg-[#23272f]' : ''}`}
              onClick={() => setSelectedIndex(selectedIndex === idx ? null : idx)}
            >
              <div className="w-12 py-2">{submissions.length - idx}</div>
              <div className={`flex-1 py-2 font-semibold ${getVerdictColor(sub.verdict)}`}>
                {sub.verdict === "Solution Accepted" ? "Accepted" : sub.verdict}
                <div className="text-xs text-gray-400 font-normal">
                  {new Date(sub.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
              <div className="w-20 py-2">
                <span className="bg-[#23272f] text-gray-200 rounded px-2 py-0.5 text-xs">{sub.language}</span>
              </div>
              <div className="w-16 flex justify-end pr-2">
                <svg className={`w-4 h-4 text-gray-400 transition-transform ${selectedIndex === idx && 'rotate-90'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Expanded details */}
            {selectedIndex === idx && (
              <div className="bg-[#222326] border border-[#313236] rounded-lg p-4 my-2 mx-2 text-gray-200">
                <div className="mb-2">
                  <span className="font-medium">Code:</span>
                  <pre className="bg-[#18191B] p-2 rounded mt-1 text-xs overflow-x-auto">{sub.code}</pre>

                  {/* Analyze Complexity */}
                  {sub.verdict === "Solution Accepted" && (
                    <div className="mt-2">
                      {!complexityResults[idx] && loadingComplexityIndex !== idx && (
                        <button
  onClick={() => handleAnalyze(sub.code, idx)}
  type="button"
  className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded transition"
>
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 00-8 0v4a4 4 0 008 0V7z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 17v1m0 4h.01M12 3v4m0 8v1m0 4h.01" />
  </svg>
  Analyze Complexity
</button>

                      )}
                      {loadingComplexityIndex === idx && (
                        <div className="mt-1 flex items-center gap-2 text-yellow-300 text-xs">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
                          </svg>
                          Analyzing...
                        </div>
                      )}
                      {complexityResults[idx] && (
                        <div className="text-blue-300 text-xs mt-2">
                          Time Complexity: <br />{complexityResults[idx]}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {sub.verdict !== "Solution Accepted" && (
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium text-gray-300">Input:</span>
                      <pre className="bg-[#1e1e1e] rounded p-2 text-xs">{sub.input}</pre>
                    </div>
                    <div>
                      <span className="font-medium text-gray-300">Expected Output:</span>
                      <pre className="bg-[#1e1e1e] rounded p-2 text-xs">{sub.expectedOutput}</pre>
                    </div>
                    <div>
                      <span className="font-medium text-gray-300">Output:</span>
                      <pre className="bg-[#1e1e1e] rounded p-2 text-xs">{sub.output}</pre>
                    </div>
                  </div>
                )}
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
