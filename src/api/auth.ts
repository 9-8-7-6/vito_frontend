import axios from 'axios'
import { setCookie, getCookie, removeCookie } from 'typescript-cookie'

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
    let errorMessage = 'Failed to do something exceptional'
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.log(errorMessage)
  }
}

export const loginUser = async (credentials: Credentials) => {
  const url = `${API_BASE_URL}/login`
  console.log(`Sending login request to`, url, `body is`, credentials)
  try {
    const response = await axios.post(url, credentials, { withCredentials: true })
    console.log(`Response of login request is`, response)
    if (response.data && response.data.token) {
      console.log('Login successful, setting cookie')
      setCookie('id', response.data.token, { path: '/' })
    }
    return response
  } catch (error) {
    let errorMessage = 'Failed to do something exceptional'
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.log(errorMessage)
    return null
  }
}

export const logoutUser = async () => {
  const url = `${API_BASE_URL}/logout`
  console.log(`Sending logout request to`, url)
  try {
    const response = await axios.post(
      url,
      {},
      {
        withCredentials: true,
      },
    )
    if (response.data && response.data.token) {
      console.log('Logout successful, cleaning cookie')
      removeCookie('id', { path: '/' })
    }
    return response
  } catch (error) {
    let errorMessage = 'Failed to do something exceptional'
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.log(errorMessage)
  }
}

export const AuthCheck = async () => {
  const url = `${API_BASE_URL}/auth/check`

  const token = getCookie('id')
  console.log('Checking authentication, token:', token)

  if (!token) {
    console.log("AuthCheck doesn't get cookie named id, something wrong happens")
    return false
  }

  try {
    const response = await axios.post(`${url}`, {}, { withCredentials: true })
    return response.status === 200
  } catch (error) {
    console.error('Auth check failed:', error)
    return false
  }
}
