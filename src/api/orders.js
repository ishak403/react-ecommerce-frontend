import axios from "axios";

const API_URL = "https://express-ecommerce-api-xedd.onrender.com/api";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const createOrder = (orderData) =>
  axios.post(`${API_URL}/orders`, orderData, { headers: getAuthHeaders() });

export const getUserOrders = () =>
  axios.get(`${API_URL}/orders/my`, { headers: getAuthHeaders() });

export const getAllOrders = () =>
  axios.get(`${API_URL}/orders`, { headers: getAuthHeaders() });

export const updateOrderStatus = (orderId, status) =>
  axios.put(
    `${API_URL}/orders/${orderId}/status`,
    { status },
    { headers: getAuthHeaders() }
  );
