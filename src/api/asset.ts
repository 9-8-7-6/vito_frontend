import axios from 'axios'
import { formatFieldDate } from '../utils/format'
import { useAuthStore } from '@/stores/auth'
import type { AxiosResponse } from 'axios'

// Define the base API URL for asset-related requests
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/assets`

/**
 * Fetches all assets for the currently logged-in user.
 * It retrieves the user ID from useAuthStore, then sends a GET request.
 * The response is formatted by converting 'updated_at' fields to readable format.
 */
export const getAsset = async (): Promise<AxiosResponse<any> | void> => {
  const authStore = useAuthStore()
  if (!authStore.userId) {
    console.error('getAsset: no userId in store, failed to get user`s asset')
    return
  }

  const url = `${API_BASE_URL}/${authStore.userId}`
  try {
    const response: AxiosResponse<any> = await axios.get(url)
    if (response.data) {
      const formatted = formatFieldDate(response.data, 'updated_at')
      return { ...response, data: formatted }
    }
    return response
  } catch (err: any) {
    console.error('getAsset failed:', err.response?.data ?? err.message)
  }
}

/**
 * Adds a new asset for the currently logged-in user.
 * Sends a POST request with asset_type and balance.
 */
export const addAsset = async (asset_type: string, balance: number) => {
  const authStore = useAuthStore()
  if (!authStore.userId) {
    console.error('addAsset: no userId in store，failed to add asset')
    return
  }
  const body = {
    account_id: authStore.userId,
    asset_type,
    balance,
  }

  try {
    const response: AxiosResponse<any> = await axios.post(API_BASE_URL, body)
    return response
  } catch (err: any) {
    console.error('addAsset fail', err.response?.data ?? err.message)
  }
}

/**
 * Deletes a specific asset by asset_id.
 * Sends a DELETE request to the backend.
 */
export const deleteAsset = async (asset_id: string): Promise<AxiosResponse<any> | void> => {
  const url = `${API_BASE_URL}/${asset_id}`
  try {
    const response: AxiosResponse<any> = await axios.delete(url)
    return response
  } catch (err: any) {
    console.error('deleteAsset failed:', err.response?.data ?? err.message)
  }
}

/**
 * Updates an existing asset by asset_id with the given fields.
 * Sends a PATCH request containing only fields that need to be updated.
 */
export const updateAsset = async (
  asset_id: string,
  fieldsToUpdate: Record<string, any>,
): Promise<AxiosResponse<any> | void> => {
  const url = `${API_BASE_URL}/${asset_id}`
  try {
    const response: AxiosResponse<any> = await axios.patch(url, fieldsToUpdate)
    return response
  } catch (err: any) {
    console.error('updateAsset failed:', err.response?.data ?? err.message)
  }
}
