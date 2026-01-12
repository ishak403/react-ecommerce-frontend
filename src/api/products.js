import axios from "axios";

const API_URL = "https://express-ecommerce-api-xedd.onrender.com/api";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchProducts = () => axios.post(`${API_URL}/products/search`, {});

export const fetchProductById = (id) =>
  axios.get(`${API_URL}/products/${id}`, { headers: getAuthHeaders() });

export const createProduct = (data) =>
  axios.post(`${API_URL}/products`, data, { headers: getAuthHeaders() });

export const updateProduct = (id, data) =>
  axios.put(`${API_URL}/products/${id}`, data, { headers: getAuthHeaders() });

export const deleteProduct = (id) =>
  axios.delete(`${API_URL}/products/${id}`, { headers: getAuthHeaders() });
