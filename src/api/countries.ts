import axios from 'axios'
import { getCookie } from 'typescript-cookie'

// Define the base URL for the countries API endpoint
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/countries`


/**
 * Utility function to retrieve the user ID from cookie.
 * @returns The user's ID as a string, or null if not found or invalid.
 */
const getUserId = (): string | null => {
  const user = getCookie('user') // Attempt to get the stored user
  if (!user) return null

  try {
    // Parse the stored JSON and extract the user ID
    return JSON.parse(user).id
  } catch {
    console.error('Invalid user data in cookie') // JSON parsing failed
    return null
  }
}

/**
 * Fetches the list of countries from the backend API.
 * Sends a GET request to /countries and logs the result.
 */
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
