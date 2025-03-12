import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface Credentials {
  username: string;
  password: string;
}

export const registerUser = async (userData: RegisterData) => {
  return axios.post(`${API_BASE_URL}/register`, userData);
};

export const loginUser = async (credentials: Credentials) => {
  return axios.post(`${API_BASE_URL}/login`, credentials);
};

export const logoutUser = async () => {
  return axios.post(`${API_BASE_URL}/logout`);
};
