import axios from 'axios'
import { setCookie, getCookie, removeCookie } from 'typescript-cookie'
import { formatFieldDate } from '../utils/format'


// Base URL for transaction-related API endpoints
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/transactions`

/**
 * Fetch all transactions for the current user from cookie.
 */
export const getTransactionsByUserId = async () => {
  const userData = getCookie('user')

  if (!userData) {
    console.error("No 'user' data found in cookie")
    return
  }

  try {
    const parsedUser: { id: string } = JSON.parse(userData)
    const url = `${API_BASE_URL}/account/${parsedUser.id}`
    const response = await axios.get(url)

    if (response && response.data) {
      // Format transaction_time field before returning
      const formattedData = formatFieldDate(response.data, 'transaction_time')
      return { ...response, data: formattedData }
    }

    console.log(
      `Sending GET request to url ${url} for ${parsedUser.id} transaction, response is ${JSON.stringify(response, null, 2)}`,
    )

    return response
  } catch (error) {
    console.error('Failed to parse user data or send request:', error)
  }
}

/**
 * Create an income transaction for the current user.
 */
export const addTransactionIncome = async (
  transaction_type: string,
  amount: number,
  to_asset_id: string,
  transaction_time: string,
  notes: string,
) => {
  const userData = getCookie('user')
  if (!userData) {
    console.error("No 'user' data found in cookie")
    return
  }

  try {
    const parsedUser: { id: string } = JSON.parse(userData)
    const url = API_BASE_URL
    const body = {
      from_asset_id: null,
      to_asset_id,
      transaction_type,
      amount,
      fee: 0,
      from_account_id: null,
      to_account_id: parsedUser.id,
      transaction_time: transaction_time || null,
      notes: notes || null,
      image: null,
    }

    const response = await axios.post(url, body)
    console.log(`[POST] Income transaction sent:`, response)
    return response
  } catch (error) {
    console.error('Failed to parse user data or send request:', error)
  }
}

/**
 * Create an expense transaction for the current user.
 */
export const addTransactionExpense = async (
  transaction_type: string,
  amount: number,
  from_asset_id: string,
  transaction_time: string,
  notes: string,
) => {
  const userData = getCookie('user')
  if (!userData) {
    console.error("No 'user' data found in cookie")
    return
  }

  try {
    const parsedUser: { id: string } = JSON.parse(userData)
    const url = API_BASE_URL
    const body = {
      from_asset_id,
      to_asset_id: null,
      transaction_type,
      amount,
      fee: 0,
      from_account_id: parsedUser.id,
      to_account_id: null,
      transaction_time: transaction_time || null,
      notes: notes || null,
      image: null,
    }

    const response = await axios.post(url, body)
    console.log(`[POST] Expense transaction sent:`, response)
    return response
  } catch (error) {
    console.error('Failed to parse user data or send request:', error)
  }
}

/**
 * Create an internal transfer transaction within the same account.
 */
export const addTransactionInternalTransfer = async (
  transaction_type: string,
  balance: number,
  fee: number,
  from_asset_id: string,
  to_asset_id: String,
  transaction_time: string,
  notes: string,
) => {
  const userData = getCookie('user')
  if (!userData) {
    console.error("No 'user' data found in cookie")
    return
  }

  try {
    const parsedUser: { id: string } = JSON.parse(userData)
    const url = API_BASE_URL
    const body = {
      from_asset_id,
      to_asset_id,
      transaction_type,
      amount: balance,
      fee,
      from_account_id: parsedUser.id,
      to_account_id: parsedUser.id,
      transaction_time,
      notes: notes || null,
      image: null,
    }

    const response = await axios.post(url, body)
    console.log(`[POST] Internal transfer transaction sent:`, response)
    return response
  } catch (error) {
    console.error('Failed to parse user data or send request:', error)
  }
}

/**
 * Create a transfer transaction between two different accounts.
 */
export const addTransactionTransfer = async (
  transaction_type: string,
  balance: number,
  fee: number,
  from_asset_id: string,
  to_asset_id: String,
  from_account_id: String,
  to_account_id: String,
  transaction_time: string,
  notes: string,
) => {
  const userData = getCookie('user')
  if (!userData) {
    console.error("No 'user' data found in cookie")
    return
  }

  try {
    const parsedUser: { id: string } = JSON.parse(userData)
    const url = API_BASE_URL
    const body = {
      from_asset_id,
      to_asset_id,
      transaction_type,
      amount: balance,
      fee,
      from_account_id,
      to_account_id,
      transaction_time,
      notes: notes || null,
      image: null,
    }

    const response = await axios.post(url, body)
    console.log(`[POST] Inter-account transfer transaction sent:`, response)
    return response
  } catch (error) {
    console.error('Failed to parse user data or send request:', error)
  }
}

/**
 * Delete a transaction by ID.
 */
export const deleteTransaction = async (transaction_id: string) => {
  try {
    const url = `${API_BASE_URL}/${transaction_id}`
    const response = await axios.delete(url)
    console.log(`[DELETE] Transaction deleted:`, response)
    return response
  } catch (error) {
    console.error('Failed to parse user data or send request:', error)
  }
}

/**
 * Update a transaction by ID with given fields.
 */
export const updateTransaction = async (
  transaction_id: string,
  updatedFields: Record<string, any>,
) => {
  try {
    const url = `${API_BASE_URL}/${transaction_id}`
    const response = await axios.patch(url, updatedFields)
    console.log(`[PATCH] Transaction updated:`, response)
    return response
  } catch (error) {
    console.error('Failed to parse user data or send request:', error)
  }
}
