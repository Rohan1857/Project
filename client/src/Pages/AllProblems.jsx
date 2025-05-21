import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

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

  if (authLoading || loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please log in to view problems.</div>;

  return (
    <div>
      <h2>All Problems</h2>
      <ul>
        {problems.map(p =>
          <li key={p._id}>
            <Link to={`/problem/${p._id}`}>{p.Title}</Link>
          </li>
        )}
      </ul>
    </div>
  );
}

export default AllProblems;