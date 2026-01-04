import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Members API
export const memberAPI = {
  getAll: () => api.get("/members"),
  getById: (id) => api.get(`/members/${id}`),
  create: (data) => api.post("/members", data),
  update: (id, data) => api.put(`/members/${id}`, data),
  delete: (id) => api.delete(`/members/${id}`),
};

// Categories API
export const categoryAPI = {
  getAll: (type) => api.get("/categories", { params: { type } }),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post("/categories", data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Expenses API
export const expenseAPI = {
  getAll: (month, year) => api.get("/expenses", { params: { month, year } }),
  getById: (id) => api.get(`/expenses/${id}`),
  create: (data) => api.post("/expenses", data),
  update: (id, data) => api.put(`/expenses/${id}`, data),
  delete: (id) => api.delete(`/expenses/${id}`),
};

// Savings API
export const savingsAPI = {
  getAll: (month, year) => api.get("/savings", { params: { month, year } }),
  getById: (id) => api.get(`/savings/${id}`),
  create: (data) => api.post("/savings", data),
  update: (id, data) => api.put(`/savings/${id}`, data),
  delete: (id) => api.delete(`/savings/${id}`),
};

// Dashboard API
export const dashboardAPI = {
  getSummary: (month, year) =>
    api.get("/dashboard/summary", { params: { month, year } }),
  getYearlySummary: (year) =>
    api.get("/dashboard/yearly-summary", { params: { year } }),
};

export default api;
