import axios from "axios";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export async function registerUser({ Username, Email, Password }) {
  const response = await axios.post(
    `${BASE_URL}/api/auth/register`,
    { Username, Email, Password }
  );
  return response.data;
}