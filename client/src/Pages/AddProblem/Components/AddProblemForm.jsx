// Components/AddProblemForm.jsx
import { useState } from "react";

export default function AddProblemForm({ onSubmit }) {
  const [form, setForm] = useState({
    Title: "",
    ProblemStatement: "",
    SampleInput: "",
    SampleOutput: "",
    Difficulty: "",
    testcases: Array(10).fill({ Input: "", Output: "" }),
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTestcaseChange = (idx, field, value) => {
    const newTestcases = form.testcases.map((tc, i) =>
      i === idx ? { ...tc, [field]: value } : tc
    );
    setForm({ ...form, testcases: newTestcases });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form, () => setForm({
      Title: "",
      ProblemStatement: "",
      SampleInput: "",
      SampleOutput: "",
      Difficulty: "",
      testcases: Array(10).fill({ Input: "", Output: "" }),
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      {}
      <input name="Title" value={form.Title} onChange={handleChange} placeholder="Title" required />
      <textarea name="ProblemStatement" value={form.ProblemStatement} onChange={handleChange} placeholder="Problem Statement" required />
      <input name="SampleInput" value={form.SampleInput} onChange={handleChange} placeholder="Sample Input" required />
      <input name="SampleOutput" value={form.SampleOutput} onChange={handleChange} placeholder="Sample Output" required />
      <input name="Difficulty" value={form.Difficulty} onChange={handleChange} placeholder="Difficulty" required />
      <h4>Testcases</h4>
      {form.testcases.map((tc, idx) => (
        <div key={idx} style={{ marginBottom: 10, border: "1px solid #ccc", padding: 8 }}>
          <div>Testcase #{idx + 1}</div>
          <textarea
            placeholder="Input"
            value={tc.Input}
            onChange={e => handleTestcaseChange(idx, "Input", e.target.value)}
            required
          />
          <textarea
            placeholder="Output"
            value={tc.Output}
            onChange={e => handleTestcaseChange(idx, "Output", e.target.value)}
            required
          />
        </div>
      ))}
      <button type="submit">Add Problem & Testcases</button>
    </form>
  );
}