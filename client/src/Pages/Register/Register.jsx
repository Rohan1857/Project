import RegisterForm from "./Components/RegisterForm";
import { registerUser } from "./api/registerApi";
import { Link } from "react-router-dom";
import { useState } from "react";


export default function Register() {
  const [loading, setLoading] = useState(false);

  const handleRegister = async (data) => {
    setLoading(true);
    try {
      const result = await registerUser(data);
      alert(result.message || "Registration successful");
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <h2 className="text-white text-3xl font-semibold mb-8 mt-2">Sign up</h2>
      <RegisterForm onSubmit={handleRegister} />
      <div className="flex items-center gap-2 mt-2 w-full max-w-md">
        <div className="flex-1 h-px bg-[#27272a]" />
        <span className="text-xs text-[#888]">or</span>
        <div className="flex-1 h-px bg-[#27272a]" />
      </div>
      <div className="text-center text-gray-400 text-sm mt-2">
        Already have an account?{" "}
        <Link to="/login" className="text-indigo-300 hover:underline">
          Sign in
        </Link>
      </div>
      {loading && <div className="text-white mt-4">Registering...</div>}
    </div>
  );
}