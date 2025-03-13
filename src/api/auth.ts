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
    let errorMessage = 'Failed to do something exceptional'
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.log(errorMessage)
  }
}

export const loginUser = async (credentials: Credentials) => {
  const url = `${API_BASE_URL}/login`
  console.log(`Sending login request to`, url)
  try {
    return axios.post(url, credentials)
  } catch (error) {
    let errorMessage = 'Failed to do something exceptional'
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.log(errorMessage)
  }
}

export const logoutUser = async () => {
  const url = `${API_BASE_URL}/logout`
  console.log(`Sending logout request to`, url)
  try {
    return axios.post(url)
  } catch (error) {
    let errorMessage = 'Failed to do something exceptional'
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.log(errorMessage)
  }
}
