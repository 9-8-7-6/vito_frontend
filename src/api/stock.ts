import axios from 'axios'

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/stock-holdings`

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

export const createStockHolding = async (
  tickerSymbol: string,
  quantity: number,
  averagePrice: number,
) => {
  const accountId = getUserId()
  if (!accountId) return

  const payload = {
    account_id: accountId,
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
