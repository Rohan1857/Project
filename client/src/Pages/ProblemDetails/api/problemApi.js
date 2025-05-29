import axios from 'axios';

export async function fetchProblem(id) {
  const token = localStorage.getItem('token');
  const res = await axios.get(`http://localhost:5000/api/admin/problem/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data;
}

export async function runCode(language, code, input) {
  const token = localStorage.getItem('token');
  const res = await axios.post(
    'http://localhost:5000/api/compiler/run',
    { language, code, input },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  return res.data;
}

export async function submitCode(problemId, language, code) {
  const token = localStorage.getItem('token');
  const res = await axios.post(
    'http://localhost:5000/api/compiler/submit',
    { problemId, language, code },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  return res.data;
}