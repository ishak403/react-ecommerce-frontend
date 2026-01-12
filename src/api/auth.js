import axios from "axios";

const API_URL = "https://express-ecommerce-api-xedd.onrender.com/api";

export const registerUser = (data) =>
  axios.post(`${API_URL}/auth/register`, data);

export const loginUser = (data) =>
  axios.post(`${API_URL}/auth/login`, data);