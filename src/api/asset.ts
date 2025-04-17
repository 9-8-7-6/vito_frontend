import axios from 'axios'
import { formatFieldDate } from '../utils/format'

// Define the base API URL for asset-related requests
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/assets`

/**
 * Fetches all assets for the currently logged-in user.
 * It retrieves the user ID from localStorage, then sends a GET request.
 * The response is formatted by converting 'updated_at' fields to readable format.
 */
export const getAsset = async () => {
  const userData = localStorage.getItem('user')

  if (!userData) {
    console.error("No 'user' data found in localStorage")
    return
  }

  try {
    const parsedUser: { id: string } = JSON.parse(userData)
    const url = `${API_BASE_URL}/${parsedUser.id}`
    const response = await axios.get(url)

    if (response && response.data) {
      const formattedData = formatFieldDate(response.data, 'updated_at')
      return { ...response, data: formattedData }
    }

    console.log(
      `Sending GET request to url ${url} for ${parsedUser.id} asset, response is ${JSON.stringify(response, null, 2)}`,
    )

    return response
  } catch (error) {
    console.error('Failed to parse user data or send request:', error)
  }
}

/**
 * Adds a new asset for the currently logged-in user.
 * Sends a POST request with asset_type and balance.
 */
export const addAsset = async (asset_type: string, balance: number) => {
  const userData = localStorage.getItem('user')

  if (!userData) {
    console.error("No 'user' data found in localStorage")
    return
  }

  try {
    const parsedUser: { id: string } = JSON.parse(userData)
    const url = API_BASE_URL
    const body = {
      account_id: parsedUser.id,
      asset_type: asset_type,
      balance: balance,
    }

    const response = await axios.post(url, body)

    console.log(
      `Sending POST request to url ${url} for ${parsedUser.id} asset, response is ${JSON.stringify(response, null, 2)}`,
    )

    return response
  } catch (error) {
    console.error('Failed to parse user data or send request:', error)
  }
}

/**
 * Deletes a specific asset by asset_id.
 * Sends a DELETE request to the backend.
 */
export const deleteAsset = async (asset_id: string) => {
  try {
    const url = `${API_BASE_URL}/${asset_id}`
    const response = await axios.delete(url)

    console.log(
      `Sending DELETE request to url ${url} for ${asset_id} asset, response: ${JSON.stringify(response, null, 2)}`,
    )

    return response
  } catch (error) {
    console.error('Failed to parse user data or send request:', error)
  }
}

/**
 * Updates an existing asset by asset_id with the given fields.
 * Sends a PATCH request containing only fields that need to be updated.
 */
export const updateAsset = async (asset_id: string, fieldsToUpdate: Record<string, any>) => {
  try {
    const url = `${API_BASE_URL}/${asset_id}`
    const response = await axios.patch(url, fieldsToUpdate)

    console.log(
      `Sending PATCH request to url ${url} for ${asset_id} asset, response: ${JSON.stringify(response, null, 2)}`,
    )

    return response
  } catch (error) {
    console.error('Failed to parse user data or send request:', error)
  }
}
