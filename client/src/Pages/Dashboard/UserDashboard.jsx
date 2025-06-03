import React, { useEffect, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import { fetchProblem } from "../ProblemDetails/api/problemApi";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
// Utility for verdict color
const getVerdictColor = (verdict) => {
  if (verdict === "Solution Accepted" || verdict === "Accepted")
    return "text-green-400";
  return "text-red-400";
};

export default function UserDashboard() {
  const { user, loading: userLoading } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [problemsMap, setProblemsMap] = useState({}); // {problemId: title}
  const [selectedIndex, setSelectedIndex] = useState(null);

  // Get username
  let username = "";
  if (user) {
    username = user.Username || user.name || user.Email || "User";
  }

  // Fetch submissions by user
  useEffect(() => {
    if (!user || (!user._id && !user.id)) return;

    setLoading(true);
    const userId = user._id || user.id;
    const token = localStorage.getItem("token");

    axios
      .get(`${BASE_URL}/api/submission/filterbyuser?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setSubmissions(res.data);
        // Fetch unique problemIds
        const uniqueProblemIds = [
          ...new Set(res.data.map((sub) => sub.problemId).filter(Boolean)),
        ];
        if (uniqueProblemIds.length) {
          // Fetch all problems in parallel
          Promise.all(
            uniqueProblemIds.map((pid) =>
              fetchProblem(pid)
                .then((prob) => ({ pid, title: prob.Title || prob.name || "Unknown Problem" }))
                .catch(() => ({ pid, title: "Unknown Problem" }))
            )
          ).then((results) => {
            const mapping = {};
            results.forEach(({ pid, title }) => {
              mapping[pid] = title;
            });
            setProblemsMap(mapping);
          });
        }
      })
      .catch((err) => {
        console.error("Error fetching submissions", err);
        setSubmissions([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);

  // Heatmap data prep
  const heatmapData = {};
  submissions.forEach((sub) => {
    const date = new Date(sub.createdAt).toISOString().slice(0, 10);
    heatmapData[date] = (heatmapData[date] || 0) + 1;
  });
  const today = new Date();
  const yearAgo = new Date();
  yearAgo.setFullYear(today.getFullYear() - 1);

  // Show spinner during loading
  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-[#18191B] text-white flex items-center justify-center">
        <div className="text-center">
          <svg
            className="animate-spin h-10 w-10 text-white mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <p className="text-lg">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#18191B] text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Username */}
        <div className="text-3xl font-bold text-center mb-8">
          {`${username}'s Dashboard`}
        </div>

        {/* Heatmap */}
        <div className="bg-[#222326] rounded-lg p-6 mb-10 shadow-lg">
          <div className="text-lg font-semibold mb-4 text-center">Submission Activity</div>
          <CalendarHeatmap
            startDate={yearAgo}
            endDate={today}
            values={Object.keys(heatmapData).map((date) => ({
              date,
              count: heatmapData[date],
            }))}
            classForValue={(value) => {
              if (!value || value.count === 0) return "color-empty";
              if (value.count < 2) return "color-github-1";
              if (value.count < 4) return "color-github-2";
              if (value.count < 8) return "color-github-3";
              return "color-github-4";
            }}
            showWeekdayLabels={true}
            gutterSize={3}
          />
          <style>
            {`
              .color-empty { fill: #222326; }
              .color-github-1 { fill: #204051; }
              .color-github-2 { fill: #3b6978; }
              .color-github-3 { fill: #84a9ac; }
              .color-github-4 { fill: #cae8d5; }
            `}
          </style>
        </div>

        {/* All Submissions Panel */}
        <div className="bg-[#222326] rounded-lg p-6 shadow-lg">
          <div className="text-lg font-semibold mb-4">All Submissions</div>
          <div className="overflow-x-auto" style={{ minHeight: 200 }}>
            <div className="flex text-xs font-semibold text-gray-300 border-b border-[#313236] pb-2 select-none">
              <div className="w-12">#</div>
              <div className="flex-1">Problem</div>
              <div className="flex-1">Status</div>
              <div className="w-20">Language</div>
              <div className="w-32">Submitted At</div>
              <div className="w-8"></div>
            </div>
            <div className="overflow-y-auto">
              {submissions.length === 0 ? (
                <div className="text-center py-6 text-gray-400">No submissions found.</div>
              ) : (
                submissions.map((sub, idx) => (
                  <React.Fragment key={sub._id || idx}>
                    <div
                      className={`flex items-center text-sm border-b border-[#232326] cursor-pointer hover:bg-[#23272f] transition ${
                        selectedIndex === idx ? "bg-[#23272f]" : ""
                      }`}
                      onClick={() => setSelectedIndex(selectedIndex === idx ? null : idx)}
                    >
                      <div className="w-12 py-2">{idx + 1}</div>
                      <div className="flex-1 py-2 font-semibold">
                        {problemsMap[sub.problemId] || sub.problemId || "Loading..."}
                      </div>
                      <div className={`flex-1 py-2 font-semibold ${getVerdictColor(sub.verdict)}`}>
                        {sub.verdict === "Solution Accepted" ? "Accepted" : sub.verdict}
                        <div className="text-xs text-gray-400 font-normal">{new Date(sub.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                      </div>
                      <div className="w-20 py-2">
                        <span className="bg-[#23272f] text-gray-200 rounded px-2 py-0.5 text-xs">{sub.language}</span>
                      </div>
                      <div className="w-32 py-2">
                        {new Date(sub.createdAt).toLocaleString()}
                      </div>
                      <div className="w-8 flex justify-end pr-2">
                        <svg className={`w-4 h-4 text-gray-400 transition-transform ${selectedIndex === idx ? "rotate-90" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                      </div>
                    </div>
                    {/* Detail view, collapsible */}
                    {selectedIndex === idx && (
                      <div className="bg-[#18191B] border border-[#313236] rounded-lg p-4 my-2 mx-2 text-gray-200">
                        <div className="mb-2">
                          <span className="font-medium">Code:</span>
                          <pre className="bg-[#222326] p-2 rounded mt-1 text-xs overflow-x-auto">{sub.code}</pre>
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
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}