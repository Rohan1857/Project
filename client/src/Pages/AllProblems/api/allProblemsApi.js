import axios from "axios";

export async function fetchAllProblems() {
  const token = localStorage.getItem("token");
  const res = await axios.get("http://localhost:5000/api/admin/Problems", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data;
}