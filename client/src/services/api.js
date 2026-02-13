import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"
});

// Add token to requests if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Authentication
export const authAPI = {
  login: (credentials) => API.post("/auth/login", credentials),
  register: (userData) => API.post("/auth/register", userData),
  getMe: () => API.get("/auth/me"),
  updateProfile: (data) => API.put("/auth/update-profile", data),
  changePassword: (data) => API.put("/auth/change-password", data)
};

// Members
export const membersAPI = {
  getAll: (params) => API.get("/members", { params }),
  getById: (id) => API.get(`/members/${id}`),
  create: (data) => API.post("/members", data),
  update: (id, data) => API.put(`/members/${id}`, data),
  delete: (id) => API.delete(`/members/${id}`),
  getFamilyTree: (id) => API.get(`/members/family-tree/${id}`),
  getStats: () => API.get("/members/stats/overview")
};

// Newborn Requests
export const newbornAPI = {
  getAll: (params) => API.get("/newborn-requests", { params }),
  getById: (id) => API.get(`/newborn-requests/${id}`),
  create: (data) => API.post("/newborn-requests", data),
  approve: (id, notes) => API.put(`/newborn-requests/${id}/approve`, { reviewNotes: notes }),
  reject: (id, notes) => API.put(`/newborn-requests/${id}/reject`, { reviewNotes: notes }),
  delete: (id) => API.delete(`/newborn-requests/${id}`)
};

// Clan History
export const historyAPI = {
  getAll: (params) => API.get("/history", { params }),
  getById: (id) => API.get(`/history/${id}`),
  create: (data) => API.post("/history", data),
  update: (id, data) => API.put(`/history/${id}`, data),
  delete: (id) => API.delete(`/history/${id}`)
};

// Media Albums
export const mediaAPI = {
  getAll: (params) => API.get("/media", { params }),
  getById: (id) => API.get(`/media/${id}`),
  create: (data) => API.post("/media", data),
  update: (id, data) => API.put(`/media/${id}`, data),
  delete: (id) => API.delete(`/media/${id}`),
  addItem: (id, item) => API.post(`/media/${id}/items`, item),
  removeItem: (albumId, itemId) => API.delete(`/media/${albumId}/items/${itemId}`)
};

// Events
export const eventsAPI = {
  getAll: (params) => API.get("/events", { params }),
  getById: (id) => API.get(`/events/${id}`),
  create: (data) => API.post("/events", data),
  update: (id, data) => API.put(`/events/${id}`, data),
  delete: (id) => API.delete(`/events/${id}`)
};

export default API;

