import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export async function addProblem(form) {
  const token = localStorage.getItem("token");
  const res = await axios.post(
    `${BASE_URL}/api/admin/AddProblem`,
    form,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
}