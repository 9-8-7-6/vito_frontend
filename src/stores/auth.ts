import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loginUser, logoutUser } from '../api/auth'

interface Credentials {
  username: string
  password: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<any>(null)

  const login = async (credentials: Credentials) => {
    try {
      const response = await loginUser(credentials)
      if (!response) {
        console.error('Login failed: No response from server')
        return false
      }
      console.log(`The response of login api is `, response)
      user.value = response.data.user
      localStorage.setItem('user', JSON.stringify(response.data.user))
      return true
    } catch (error) {
      console.error('Login failed:', error)
      return false
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
