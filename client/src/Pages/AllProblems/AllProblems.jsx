import { useAuth } from "../../hooks/useAuth";
import ProblemsList from "./Components/ProblemsList";
import { useAllProblems } from "./hooks/useAllProblems.js";
import "../../App.css";

function AllProblems() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { problems, loading } = useAllProblems(isAuthenticated);

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
      <ProblemsList problems={problems} />
    </div>
  );
}

export default AllProblems;