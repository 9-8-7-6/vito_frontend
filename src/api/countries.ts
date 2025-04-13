import axios from 'axios'

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/countries`

const getUserId = (): string | null => {
  const user = localStorage.getItem('user')
  if (!user) return null
  try {
    return JSON.parse(user).id
  } catch {
    console.error('Invalid user data in localStorage')
    return null
  }
}

export const fetchCountries = async () => {
  const url = `${API_BASE_URL}`
  try {
    const response = await axios.get(url)
    console.log(`[GET] ${url} - Countries fetched:`, response)
    return response
  } catch (error) {
    console.error('Error fetching Countries info:', error)
  }
}
