import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loginUser, logoutUser } from '../api/auth'

interface Credentials {
  username: string
  password: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<any>(JSON.parse(localStorage.getItem('user') || 'null'))

  const login = async (credentials: Credentials) => {
    try {
      const response = await loginUser(credentials)
      user.value = response.data.user
      localStorage.setItem('user', JSON.stringify(response.data.user))
      return true
    } catch (error) {
      console.error('Login failed in store:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await logoutUser()
      user.value = null
      localStorage.removeItem('user')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return { user, login, logout }
})
