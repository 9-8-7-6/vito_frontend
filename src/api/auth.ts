import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

export interface RegisterData {
  username: string
  email: string
  password: string
}

export interface Credentials {
  username: string
  password: string
}

export const registerUser = async (userData: RegisterData) => {
  const url = `${API_BASE_URL}/register`
  console.log(`Sending register request to`, url)
  try {
    return axios.post(url, userData)
  } catch (error) {
    if (error.response) {
      console.error('Register API Error:', error.response.data)
    } else {
      console.error('Register API Request Failed:', error.message)
    }
    throw error
  }
}

export const loginUser = async (credentials: Credentials) => {
  const url = `${API_BASE_URL}/login`
  console.log(`Sending login request to`, url)
  try {
    return axios.post(url, credentials)
  } catch (error) {
    if (error.response) {
      console.error('Login API Error:', error.response.data)
    } else {
      console.error('Login API Request Failed:', error.message)
    }
    throw error
  }
}

export const logoutUser = async () => {
  return axios.post(`${API_BASE_URL}/logout`)
}
