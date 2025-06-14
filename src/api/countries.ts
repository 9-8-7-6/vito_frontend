import axios from 'axios'

// Define the base URL for the countries API endpoint
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/countries`

/**
 * Fetches the list of countries from the backend API.
 * Sends a GET request to /countries and logs the result.
 */
export const fetchCountries = async () => {
  const url = `${API_BASE_URL}`

  try {
    const response = await axios.get(url)
    return response
  } catch (error) {
    console.error('Error fetching Countries info:', error)
  }
}
