import { useEffect, useState } from 'react';
import { fetchProblem } from '../api/problemApi';

export function useProblem(id) {
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProblem = async () => {
      setLoading(true);
      try {
        const data = await fetchProblem(id);
        setProblem(data);
        setError(null);
      } catch {
        setError('Failed to fetch problem');
        setProblem(null);
      } finally {
        setLoading(false);
      }
    };
    getProblem();
  }, [id]);

  return { problem, loading, error };
}