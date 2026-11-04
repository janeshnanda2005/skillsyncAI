import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://skillsyncai-d5pk.onrender.com";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("skill-sync-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Auth ────────────────────────────────────────────────────────────────
export async function loginUser(email, password) {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
}

export async function signupUser(name, email, password, correct_password) {
  const response = await api.post("/auth/register", { name, email, password, correct_password });
  return response.data;
}

export async function verifyToken() {
  const response = await api.post("/auth/verify-token");
  return response.data;
}

export async function getCurrentUser() {
  const response = await api.get("/auth/current-user");
  return response.data;
}

export async function logoutUser() {
  const response = await api.post("/auth/logout");
  return response.data;
}

// ─── Admin ───────────────────────────────────────────────────────────────
export async function loginAdmin(email, password) {
  const response = await api.post("/admin/login", { email, password });
  return response.data;
}

export async function registerAdmin(name, email, password, correct_password) {
  const response = await api.post("/admin/register", { name, email, password, correct_password });
  return response.data;
}

// ─── Student Profile ─────────────────────────────────────────────────────
export async function getMyProfile() {
  const response = await api.get("/students/students-me");
  return response.data;
}

export async function addStudentDetails(data) {
  const response = await api.post("/students/add-student-details", data);
  return response.data;
}

// ─── Skills ──────────────────────────────────────────────────────────────
export async function getMySkills() {
  const response = await api.get("/skills/my-skills");
  return response.data;
}

export async function addSkill(title) {
  const response = await api.post("/skills/add-skill", { title });
  return response.data;
}

// ─── Certifications ──────────────────────────────────────────────────────
export async function getMyCertifications() {
  const response = await api.get("/certifications/my-certifications");
  return response.data;
}

export async function addCertification(title) {
  const response = await api.post("/certifications/add-cert", { title });
  return response.data;
}

// ─── Projects ────────────────────────────────────────────────────────────
export async function getMyProjects() {
  const response = await api.get("/projects/my-projects");
  return response.data;
}

export async function addProject(title, description) {
  const response = await api.post("/projects/add-project", { title, description });
  return response.data;
}

// ─── Resume ──────────────────────────────────────────────────────────────
export async function uploadResume(file) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post("/resume/upload-resume", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function getResume() {
  const response = await api.get("/resume/get-resume");
  return response.data;
}

export async function deleteResume() {
  const response = await api.delete("/resume/delete-resume");
  return response.data;
}

// ─── AI Chat ─────────────────────────────────────────────────────────────
export async function aiChat(message) {
  const response = await api.post("/ai/ai-chat", { msg: message });
  return response.data;
}

// ─── Assessments ─────────────────────────────────────────────────────────
export async function getAssessments() {
  const response = await api.get("/assesments/assesments/");
  return response.data;
}

export default api;