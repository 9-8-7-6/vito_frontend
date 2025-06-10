import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loginUser, logoutUser } from '../api/auth'
import type { AxiosResponse } from 'axios'

// Define the structure of credentials used for login
interface Credentials {
  username: string
  password: string
}

interface LoginResult {
  status: string
  message: string
  uuid: string
}

// Create a Pinia store named 'auth'
export const useAuthStore = defineStore('auth', () => {
  // Reactive user state initialized from cookie (if available)
  const userId = ref<string | null>(null)

  // Login function: attempts login, stores user data if successful
  const login = async (credentials: Credentials) => {
    try {
      const resp: AxiosResponse<LoginResult> = await loginUser(credentials)
      userId.value = resp.data.uuid
      return true
    } catch (err) {
      console.error('Login failed:', err)
      return false
    }
  }

  // Logout function: clears user session and cookie
  const logout = async () => {
    try {
      await logoutUser()
      userId.value = null
      return true
    } catch (err) {
      console.error('Logout failed:', err)
      return false
    }
  }

  // Expose state and methods
  return { userId, login, logout }
})
