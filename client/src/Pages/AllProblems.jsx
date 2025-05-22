import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../App.css';

function AllProblems() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/api/admin/Problems', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(res => setProblems(res.data))
      .catch(() => setProblems([]))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (authLoading || loading)
    return (
      <div className="ap-bg">
        <div className="ap-title">Loading...</div>
      </div>
    );
  if (!isAuthenticated)
    return (
      <div className="ap-bg">
        <div className="ap-title">Please log in to view problems.</div>
      </div>
    );

  return (
    <div className="ap-bg">
      <div className="ap-title">All Problems</div>
      <div className="ap-list-scroll">
        {problems.length === 0 && (
          <div className="ap-list-empty">No problems found.</div>
        )}
        {problems.map(p =>
          <Link className="ap-list-item" to={`/problem/${p._id}`} key={p._id}>
            {p.Title}
          </Link>
        )}
      </div>
    </div>
  );
}

export default AllProblems;