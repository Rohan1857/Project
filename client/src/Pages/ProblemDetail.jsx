import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import '../index.css';

function ProblemDetails() {
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  if (loading)
    return (
      <div className="pd-bg">
        <div className="pd-loading">Loading...</div>
      </div>
    );
  if (error)
    return (
      <div className="pd-bg">
        <div className="pd-error">{error}</div>
      </div>
    );
  if (!problem)
    return (
      <div className="pd-bg">
        <div className="pd-error">Problem not found.</div>
      </div>
    );

  return (
    <div className="pd-bg">
      <div className="pd-container">
        <div className="pd-header-row">
          <span className="pd-title">{problem.Title}</span>
          <span className={`pd-difficulty pd-difficulty-${problem.Difficulty?.toLowerCase()}`}>{problem.Difficulty}</span>
        </div>
        <div className="pd-section">
          <div className="pd-section-title">Problem Statement</div>
          <div className="pd-statement">{problem.ProblemStatement}</div>
        </div>
        <div className="pd-section">
          <div className="pd-section-title">Sample Input</div>
          <pre className="pd-pre">{problem.SampleInput}</pre>
        </div>
        <div className="pd-section">
          <div className="pd-section-title">Sample Output</div>
          <pre className="pd-pre">{problem.SampleOutput}</pre>
        </div>
        <div className="pd-submit-link-row">
          <Link className="pd-submit-link" to={`/submit/${problem._id}`}>Submit Solution</Link>
        </div>
      </div>
    </div>
  );
}

export default ProblemDetails;