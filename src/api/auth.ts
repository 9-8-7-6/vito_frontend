import axios from 'axios'
import { setCookie, getCookie, removeCookie } from 'typescript-cookie'

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
export const registerUser = async (userData: RegisterData) => {
  const url = `${API_BASE_URL}/register`
  console.log(`Sending register request to`, url)
  try {
    return axios.post(url, userData)
  } catch (error: any) {
    const errMessage =
      error.response?.data?.message || error.message || 'Unknown Error during registration'
    console.error('Register failed:', errMessage)
    throw new Error(errMessage)
  }
}

/**
 * Logs in a user by sending a POST request to /login with credentials.
 * Automatically handles session cookie if login is successful.
 * @param credentials - Contains username and password.
 */
export const loginUser = async (credentials: Credentials) => {
  const url = `${API_BASE_URL}/login`
  console.log(`Sending login request to`, url, `body is`, credentials)

  try {
    const response = await axios.post(url, credentials, { withCredentials: true })
    console.log(`Response of login request is`, response)

    // Server should respond with a success status
    if (response.data.status !== 'success') {
      throw new Error(response.data.message || 'Login failed on server')
    }

    return response
  } catch (error: any) {
    const errMessage =
      error.response?.data?.message || error.message || 'Unknown Error during login'
    console.error('Login failed:', errMessage)
    throw new Error(errMessage)
  }
}

/**
 * Logs out the current user by calling the /logout endpoint.
 * Also removes session cookie 'id' if the response contains a token.
 */
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

    // Cleanup client-side cookie if the backend indicates logout success
    if (response.data && response.data.token) {
      console.log('Logout successful, cleaning cookie')
      removeCookie('id', { path: '/' })
    }

    return response
  } catch (error) {
    let errorMessage = 'Failed to perform logout'
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.log(errorMessage)
  }
}

/**
 * Checks if the current user session is valid by calling /auth/check.
 * Returns `true` if session is valid, otherwise `false`.
 */
export const AuthCheck = async () => {
  const url = `${API_BASE_URL}/auth/check`

  try {
    const response = await axios.post(`${url}`, {}, { withCredentials: true })
    return response.status === 200
  } catch (error) {
    console.error('Auth check failed:', error)
    return false
  }
}
