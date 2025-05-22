import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submitForm = async (e) => {
    e.preventDefault();
    const data = {
      Username: username,
      Email: email,
      Password: password,
    };
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', data);
      alert(response.data.message || 'Registration successful');
    } catch (error) {
      alert(error.response?.data?.message || 'An error occurred during registration');
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      
      <h2 className="text-white text-3xl font-semibold mb-8 mt-2">Sign up</h2>
      <form
        onSubmit={submitForm}
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
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 h-px bg-[#27272a]" />
          <span className="text-xs text-[#888]">or</span>
          <div className="flex-1 h-px bg-[#27272a]" />
        </div>
        <div className="text-center text-gray-400 text-sm mt-2">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-300 hover:underline">
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Register;