import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://skillsyncai-d5pk.onrender.com";

export async function loginUser(email, password) {
  const response = await axios.post(`${API_URL}/auth/login`, { email, password });
  return response.data;
}

export async function signupUser(name, email, password) {
  const response = await axios.post(`${API_URL}/auth/signup`, { name, email, password });
  return response.data;
}

export async function forgotPassword(email) {
  const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
  return response.data;
}

export async function resetPassword(token, password) {
  const response = await axios.post(`${API_URL}/auth/reset-password`, { token, password });
  return response.data;
}