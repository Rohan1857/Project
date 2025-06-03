import axios from "axios";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
export async function loginUser({ Username, Password }) {
  const response = await axios.post(
    `${BASE_URL}/api/auth/login`,
    { Username, Password }
  );
  return response.data;
}