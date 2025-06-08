import axios from 'axios'
import { formatFieldDate } from '../utils/format'
import { getCookie } from 'typescript-cookie'


// Define the base URL for user-related API endpoints
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/users`

/**
 * Fetch the current user's data from the backend using their ID stored in cookie.
 *
 * - Checks if user data exists in cookie
 * - Parses the user object to retrieve the ID
 * - Sends a GET request to `/users/{id}`
 * - Logs and returns the server response
 */
export const getUserData = async () => {
  const userData = getCookie('user')

  if (!userData) {
    console.error("No 'user' data found in cookie")
    return
  }

  try {
    const parsedUser: { id: string } = JSON.parse(userData)
    const url = `${API_BASE_URL}/${parsedUser.id}`
    const response = await axios.get(url)

    console.log(
      `Sending GET request to url ${url} for ${parsedUser.id} user, response is ${JSON.stringify(response, null, 2)}`,
    )

    return response
  } catch (error) {
    console.error('Failed to parse user data or send request:', error)
  }
}

/**
 * Update the user's information in the backend.
 *
 * @param user_id - UUID of the user to update
 * @param fieldsToUpdate - A key-value object containing only the fields to be updated
 *
 * - Constructs the API endpoint `/users/{id}`
 * - Sends a PATCH request with only the changed fields
 * - Logs and returns the response
 */
export const updateUserData = async (user_id: string, fieldsToUpdate: Record<string, any>) => {
  try {
    const url = `${API_BASE_URL}/${user_id}`

    const response = await axios.patch(url, fieldsToUpdate)

    console.log(
      `Sending PATCH request to url ${url} for ${user_id} user, response: ${JSON.stringify(response, null, 2)}`,
    )

    return response
  } catch (error) {
    console.error('Failed to parse user data or send request:', error)
  }
}
