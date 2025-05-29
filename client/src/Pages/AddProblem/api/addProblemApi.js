import axios from "axios";

export async function addProblem(form) {
  const token = localStorage.getItem("token");
  const res = await axios.post(
    "http://localhost:5000/api/admin/AddProblem",
    form,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
}