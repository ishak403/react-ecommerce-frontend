import axios from "axios";

const API_URL = "https://express-ecommerce-api-xedd.onrender.com/api";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getCart = () =>
  axios.get(`${API_URL}/cart`, { headers: getAuthHeaders() });

export const addToCart = (productId, quantity = 1) =>
  axios.post(
    `${API_URL}/cart`,
    {
      productId,
      quantity,
    },
    { headers: getAuthHeaders() }
  );

export const updateCartItem = (productId, quantity) =>
  axios.put(
    `${API_URL}/cart/${productId}`,
    {
      quantity,
    },
    { headers: getAuthHeaders() }
  );

export const removeCartItem = (productId) =>
  axios.delete(`${API_URL}/cart/${productId}`, { headers: getAuthHeaders() });
