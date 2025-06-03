import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
export async function fetchProblem(id) {
  const token = localStorage.getItem('token');
  const res = await axios.get(`${BASE_URL}/api/admin/problem/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data;
}

export async function runCode(language, code, input) {
  const token = localStorage.getItem('token');
  const res = await axios.post(
    `${BASE_URL}/api/compiler/run`,
    { language, code, input },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  return res.data;
}

export async function submitCode(problemId, language, code) {
  const token = localStorage.getItem('token');
  const res = await axios.post(
    `${BASE_URL}/api/compiler/submit`,
    { problemId, language, code },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  return res.data;
}