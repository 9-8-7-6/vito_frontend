import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const registerUser = async (userData) => {
  return axios.post(`${API_BASE_URL}/register`, userData);
};

export const loginUser = async (credentials) => {
  return axios.post(`${API_BASE_URL}/login`, credentials);
};

export const logoutUser = async () => {
  return axios.post(`${API_BASE_URL}/logout`);
};
