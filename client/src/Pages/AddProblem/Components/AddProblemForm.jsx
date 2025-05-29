import { useState } from "react";

const initialForm = {
  Title: "",
  ProblemStatement: "",
  SampleInput: "",
  SampleOutput: "",
  Difficulty: "",
};

export default function AddProblemForm({ onSubmit }) {
  const [form, setForm] = useState(initialForm);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form, () => setForm(initialForm));
  };

  return (
    <form onSubmit={handleSubmit}>
      {Object.keys(initialForm).map((field) => (
        <div key={field}>
          <input
            name={field}
            placeholder={field.replace(/([A-Z])/g, " $1").trim()}
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
  );
}