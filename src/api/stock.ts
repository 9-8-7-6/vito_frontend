import axios from 'axios'

// Base URL for stock holding API endpoints
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/stock-holding`

/**
 * Utility function to get the logged-in user's ID from localStorage.
 * Returns null if not found or invalid.
 */
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

/**
 * Fetch all stock holdings for the current user (by account ID).
 */
export const fetchStockHoldingsByAccount = async () => {
  const accountId = getUserId()
  if (!accountId) return

  const url = `${API_BASE_URL}/account/${accountId}`
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
  const accountId = getUserId()
  if (!accountId) return

  const payload = {
    account_id: accountId,
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
