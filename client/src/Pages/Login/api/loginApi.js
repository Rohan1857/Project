import axios from "axios";

export async function loginUser({ Username, Password }) {
  const response = await axios.post(
    "http://localhost:5000/api/auth/login",
    { Username, Password }
  );
  return response.data;
}