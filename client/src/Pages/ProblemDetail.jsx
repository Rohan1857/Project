import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!problem) return <p>Problem not found.</p>;

  return (
    <div>
      <h2>{problem.Title}</h2>
      <p><strong>Problem Statement:</strong> {problem.ProblemStatement}</p>
      <p><strong>Sample Input:</strong> {problem.SampleInput}</p>
      <p><strong>Sample Output:</strong> {problem.SampleOutput}</p>
      <p><strong>Difficulty:</strong> {problem.Difficulty}</p>
      <Link to={`/submit/${problem._id}`}>Submit Solution</Link>
    </div>
  );
}

export default ProblemDetails;