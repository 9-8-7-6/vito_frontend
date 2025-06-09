import axios from 'axios'
import type { AxiosResponse } from 'axios'
import { useAuthStore } from '@/stores/auth'

// Base URL for stock holding API endpoints
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/stock-holding`

/**
 * Fetch all stock holdings for the current user (by account ID).
 */
export const fetchStockHoldingsByAccount = async () => {
  const authStore = useAuthStore()
  if (!authStore.userId) {
    console.error('fetchStockHoldingsByAccount: no userId in store, 無法取得持股資料')
    return
  }

  const url = `${API_BASE_URL}/account/${authStore.userId}`
  try {
    const response = await axios.get(url)
    console.log(`[GET] ${url} - Stock holdings:`, response)
    return response
  } catch (error) {
    console.error('Error fetching stock holdings:', error)
  }
}

/**
 * Create a new stock holding for the current user.
 * @param tickerSymbol - Stock ticker symbol (e.g. AAPL)
 * @param quantity - Number of shares
 * @param averagePrice - Average price per share
 * @param country - Country code (e.g. "US")
 */
export const createStockHolding = async (
  tickerSymbol: string,
  quantity: number,
  averagePrice: number,
  country: string,
) => {
  const authStore = useAuthStore()
  if (!authStore.userId) {
    console.error('createStockHolding: no userId in store，無法建立持股')
    return
  }

  const payload = {
    account_id: authStore.userId,
    country,
    ticker_symbol: tickerSymbol,
    quantity,
    average_price: averagePrice,
  }

  try {
    const response = await axios.post(API_BASE_URL, payload)
    console.log(`[POST] ${API_BASE_URL} - New stock holding:`, response)
    return response
  } catch (error) {
    console.error('Error creating stock holding:', error)
  }
}

/**
 * Update an existing stock holding.
 * @param holdingId - The ID of the stock holding to update
 * @param update - Fields to update (quantity and/or average_price)
 */
export const updateStockHolding = async (
  holdingId: string,
  update: {
    quantity?: number
    average_price?: number
  },
) => {
  const url = `${API_BASE_URL}/${holdingId}`
  try {
    const response = await axios.put(url, update)
    console.log(`[PUT] ${url} - Updated holding:`, response)
    return response
  } catch (error) {
    console.error('Error updating stock holding:', error)
  }
}

/**
 * Delete a stock holding by ID.
 * @param holdingId - The ID of the stock holding to delete
 */
export const deleteStockHolding = async (holdingId: string) => {
  const url = `${API_BASE_URL}/${holdingId}`
  try {
    const response = await axios.delete(url)
    console.log(`[DELETE] ${url} - Deleted stock holding:`, response)
    return response
  } catch (error) {
    console.error('Error deleting stock holding:', error)
  }
}
