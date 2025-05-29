import { Link } from "react-router-dom";

function ProblemsListItem({ problem }) {
  return (
    <Link className="ap-list-item" to={`/problem/${problem._id}`}>
      {problem.Title}
    </Link>
  );
}

export default ProblemsListItem;