import axios from "axios";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
export async function fetchAllProblems() {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${BASE_URL}/api/admin/Problems`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data;
}