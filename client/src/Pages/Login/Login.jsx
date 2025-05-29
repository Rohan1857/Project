import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import LoginForm from "./Components/LoginForm";
import { loginUser } from "./api/loginApi";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (data) => {
    setLoading(true);
    try {
      const response = await loginUser(data);
      localStorage.setItem("token", response.token);
      if (response.token) {
        navigate("/problems");
      } else {
        alert("Login failed");
      }
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred during Login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <h2 className="text-white text-3xl font-semibold mb-8 mt-2">Sign in</h2>
      <LoginForm onSubmit={handleLogin} />
      <div className="flex items-center gap-2 mt-2 w-full max-w-md">
        <div className="flex-1 h-px bg-[#27272a]" />
        <span className="text-xs text-[#888]">or</span>
        <div className="flex-1 h-px bg-[#27272a]" />
      </div>
      <div className="text-center text-gray-400 text-sm mt-2">
        Don't have an account?{" "}
        <Link to="/register" className="text-indigo-300 hover:underline">
          Sign up
        </Link>
      </div>
      {loading && <div className="text-white mt-4">Signing in...</div>}
    </div>
  );
}