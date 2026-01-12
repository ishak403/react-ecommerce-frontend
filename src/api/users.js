import axios from "axios";

const API_URL = "https://express-ecommerce-api-xedd.onrender.com/api";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchUser = () =>
  axios.get(`${API_URL}/users/me`, { headers: getAuthHeaders() });
