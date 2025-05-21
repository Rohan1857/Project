import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function AddProblem() {
  const [form, setForm] = useState({
    Title: '', ProblemStatement: '', SampleInput: '', SampleOutput: '', Difficulty: ''
  });
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated || !user?.isAdmin) return <div>You are not authorized to access this page.</div>;

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submitForm = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/admin/AddProblem',
        form,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      alert(res.data.message || 'Problem added successfully');
      setForm({ Title: '', ProblemStatement: '', SampleInput: '', SampleOutput: '', Difficulty: '' });
    } catch (error) {
      const status = error.response?.status;
      if (status === 401 || status === 403) {
        alert('You are not authorized. Please login as an admin.');
        navigate('/login');
      } else if (status === 400) {
        alert('Bad request');
      } else {
        alert('Server error');
      }
    }
  };

  return (
    <div>
      <h2>Add Problem</h2>
      <form onSubmit={submitForm}>
        {["Title", "ProblemStatement", "SampleInput", "SampleOutput", "Difficulty"].map(field => (
          <div key={field}>
            <input
              name={field}
              placeholder={field.replace(/([A-Z])/g, ' $1').trim()}
              type="text"
              value={form[field]}
              onChange={handleChange}
              required
            />
            <br />
          </div>
        ))}
        <button type="submit">Add Problem</button>
      </form>
    </div>
  );
}

export default AddProblem;