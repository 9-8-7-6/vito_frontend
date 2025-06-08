import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loginUser, logoutUser } from '../api/auth'
import { getCookie, removeCookie, setCookie } from 'typescript-cookie'

// Define the structure of credentials used for login
interface Credentials {
  username: string
  password: string
}

// Create a Pinia store named 'auth'
export const useAuthStore = defineStore('auth', () => {
  // Reactive user state initialized from cookie (if available)
  const user = ref<any>(JSON.parse(getCookie('user') || 'null'))

  // Login function: attempts login, stores user data if successful
  const login = async (credentials: Credentials) => {
    try {
      const response = await loginUser(credentials)
      user.value = response.data.user // Update the user state
      setCookie('user', JSON.stringify(response.data.user), {
        path: '/',
        sameSite: 'none',
        secure: true,
      }) // Persist to cookie
      return true
    } catch (error) {
      console.error('Login failed in store:', error)
      throw error // Let the caller handle login errors
    }
  }

  // Logout function: clears user session and cookie
  const logout = async () => {
    try {
      await logoutUser()
      user.value = null // Clear user state
      removeCookie('user', { path: '/' }) // Remove from cookie
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  // Expose state and methods
  return { user, login, logout }
})
