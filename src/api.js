import axios from 'axios'

const API_URL = 'http://localhost:80/api/'

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}login/`, {
      username,
      password,
    })
    return response.data
  } catch (error) {
    throw error.response.data
  }
}

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
