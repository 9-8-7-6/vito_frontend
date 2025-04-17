import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loginUser, logoutUser } from '../api/auth'

// Define the structure of credentials used for login
interface Credentials {
  username: string
  password: string
}

// Create a Pinia store named 'auth'
export const useAuthStore = defineStore('auth', () => {
  // Reactive user state initialized from localStorage (if available)
  const user = ref<any>(JSON.parse(localStorage.getItem('user') || 'null'))

  // Login function: attempts login, stores user data if successful
  const login = async (credentials: Credentials) => {
    try {
      const response = await loginUser(credentials)
      user.value = response.data.user // Update the user state
      localStorage.setItem('user', JSON.stringify(response.data.user)) // Persist to localStorage
      return true
    } catch (error) {
      console.error('Login failed in store:', error)
      throw error // Let the caller handle login errors
    }
  }

  // Logout function: clears user session and localStorage
  const logout = async () => {
    try {
      await logoutUser()
      user.value = null // Clear user state
      localStorage.removeItem('user') // Remove from localStorage
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  // Expose state and methods
  return { user, login, logout }
})
