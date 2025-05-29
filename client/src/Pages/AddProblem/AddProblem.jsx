import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import AddProblemForm from "./Components/AddProblemForm";
import { addProblem } from "./api/addProblemApi";

export default function AddProblem() {
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated || !user?.isAdmin)
    return <div>You are not authorized to access this page.</div>;

  const handleAddProblem = async (form, resetForm) => {
    try {
      const data = await addProblem(form);
      alert(data.message || "Problem added successfully");
      resetForm();
    } catch (error) {
      const status = error.response?.status;
      if (status === 401 || status === 403) {
        alert("You are not authorized. Please login as an admin.");
        navigate("/login");
      } else if (status === 400) {
        alert("Bad request");
      } else {
        alert("Server error");
      }
    }
  };

  return (
    <div>
      <h2>Add Problem</h2>
      <AddProblemForm onSubmit={handleAddProblem} />
    </div>
  );
}