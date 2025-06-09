import axios from 'axios'
import type { AxiosResponse } from 'axios'

// Base URL for the backend API, pulled from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// Interface for user registration data
export interface RegisterData {
  username: string
  email: string
  password: string
}

// Interface for login credentials
export interface Credentials {
  username: string
  password: string
}

/**
 * Registers a new user by sending a POST request to /register.
 * @param userData - Contains username, email, and password.
 */
export const registerUser = async (userData: RegisterData): Promise<AxiosResponse<any>> => {
  const url = `${API_BASE_URL}/register`
  const response = await axios.post(url, userData)
  return response
}

/**
 * Logs in a user by sending a POST request to /login with credentials.
 * Automatically handles session cookie if login is successful.
 * @param credentials - Contains username and password.
 */
export const loginUser = async (credentials: Credentials): Promise<AxiosResponse<any>> => {
  const url = `${API_BASE_URL}/login`
  const response = await axios.post(url, credentials)
  if (response.data.status !== 'success') {
    throw new Error(response.data.message || 'Login failed on server')
  }
  return response
}

/**
 * Logs out the current user by calling the /logout endpoint.
 * Also removes session cookie 'id' if the response contains a token.
 */
export const logoutUser = async (): Promise<AxiosResponse<any>> => {
  const url = `${API_BASE_URL}/logout`
  const response = await axios.post(url)
  if (response.data.status !== 'success') {
    throw new Error(response.data.message || 'Logout failed on server')
  }
  return response
}

/**
 * Checks if the current user session is valid by calling /auth/check.
 * Returns `true` if session is valid, otherwise `false`.
 */
export const AuthCheck = async (): Promise<boolean> => {
  const url = `${API_BASE_URL}/auth/check`
  try {
    const response = await axios.post(url, {})
    return response.status === 200
  } catch {
    return false
  }
}
