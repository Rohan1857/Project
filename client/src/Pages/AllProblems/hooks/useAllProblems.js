import { useEffect, useState } from "react";
import { fetchAllProblems } from "../api/allProblemsApi";

export function useAllProblems(isAuthenticated) {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    setLoading(true);
    fetchAllProblems()
      .then(setProblems)
      .catch(() => setProblems([]))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  return { problems, loading };
}