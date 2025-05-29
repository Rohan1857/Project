import { useState } from "react";

export default function RegisterForm({ onSubmit }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ Username: username, Email: email, Password: password });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#18181b] rounded-xl shadow-lg w-full max-w-md p-8 flex flex-col gap-6"
    >
      <div>
        <label className="block text-sm font-medium text-white mb-1">Username</label>
        <input
          type="text"
          placeholder="Your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full bg-transparent border border-[#27272a] rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/20"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-white mb-1">Email</label>
        <input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-transparent border border-[#27272a] rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/20"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-white mb-1">Password</label>
        <input
          type="password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full bg-transparent border border-[#27272a] rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/20"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-white text-black font-medium rounded-md py-2 mt-2 hover:bg-gray-200 transition"
      >
        Continue
      </button>
    </form>
  );
}