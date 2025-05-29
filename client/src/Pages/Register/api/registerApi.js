import axios from "axios";

export async function registerUser({ Username, Email, Password }) {
  const response = await axios.post(
    "http://localhost:5000/api/auth/register",
    { Username, Email, Password }
  );
  return response.data;
}