import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

// Base URL for currency holding API endpoints
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/currency-holding`

/**
 * Fetch all currency holdings for the current user (by account ID)
 */
export const fetchCurrencyHoldingsByAccount = async () => {
  const authStore = useAuthStore()
  if (!authStore.userId) {
    console.error('fetchCurrencyHoldingsByAccount: userId is missing from auth store')
    return
  }

  const url = `${API_BASE_URL}/account/${authStore.userId}`
  try {
    const response = await axios.get(url)
    return response.data
  } catch (error) {
    console.error('Error fetching currency holdings:', error)
  }
}

/**
 * Create or update a currency holding for the current user
 * (if the same currency_code already exists, it will be merged)
 *
 * @param country - Country code (e.g., "TW", "US", "JP")
 * @param currencyCode - Currency code (e.g., "TWD", "USD", "JPY")
 * @param amountHeld - The amount of currency held
 * @param averageCostPerUnit - Average cost per unit (in base currency)
 */
export const createCurrencyHolding = async (
  country: string,
  currencyCode: string,
  amountHeld: number,
  averageCostPerUnit: number,
) => {
  const authStore = useAuthStore()
  if (!authStore.userId) {
    console.error('createCurrencyHolding: userId is missing from auth store')
    return
  }

  const payload = {
    account_id: authStore.userId,
    country,
    currency_code: currencyCode,
    amount_held: amountHeld,
    average_cost_per_unit: averageCostPerUnit,
  }

  try {
    const response = await axios.post(API_BASE_URL, payload)
    return response.data
  } catch (error) {
    console.error('Error creating currency holding:', error)
  }
}

/**
 * Update an existing currency holding
 *
 * @param holdingId - UUID of the currency holding record
 * @param update - Object with optional fields to update
 */
export const updateCurrencyHolding = async (
  holdingId: string,
  update: {
    amount_held?: number
    average_cost_per_unit?: number
  },
) => {
  const url = `${API_BASE_URL}/${holdingId}`
  try {
    const response = await axios.put(url, update)
    return response.data
  } catch (error) {
    console.error('Error updating currency holding:', error)
  }
}

/**
 * Delete a currency holding by ID
 *
 * @param holdingId - UUID of the currency holding record
 */
export const deleteCurrencyHolding = async (holdingId: string) => {
  const url = `${API_BASE_URL}/${holdingId}`
  try {
    const response = await axios.delete(url)
    return response.data
  } catch (error) {
    console.error('Error deleting currency holding:', error)
  }
}
