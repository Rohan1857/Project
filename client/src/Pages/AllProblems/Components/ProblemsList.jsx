import ProblemsListItem from "./ProblemsListItem";

function ProblemsList({ problems }) {
  if (!problems.length) {
    return <div className="ap-list-empty">No problems found.</div>;
  }
  return (
    <div className="ap-list-scroll">
      {problems.map((p) => (
        <ProblemsListItem key={p._id} problem={p} />
      ))}
    </div>
  );
}

export default ProblemsList;