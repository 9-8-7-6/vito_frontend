import axios from 'axios'
import { formatFieldDate } from '../utils/format'
import type { AxiosResponse } from 'axios'
import { useAuthStore } from '@/stores/auth'

// Base URL for transaction-related API endpoints
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/transactions`

/**
 * Fetch all transactions for the current user from cookie.
 */
export const getTransactionsByUserId = async () => {
  const authStore = useAuthStore()
  if (!authStore.userId) {
    console.error('getTransactionsByUserId: no userId in store，無法取得交易資料')
    return
  }

  const url = `${API_BASE_URL}/account/${authStore.userId}`
  try {
    const response: AxiosResponse<any> = await axios.get(url)
    if (response.data) {
      const formatted = formatFieldDate(response.data, 'transaction_time')
      return { ...response, data: formatted }
    }
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
  const authStore = useAuthStore()
  if (!authStore.userId) {
    console.error('addTransactionIncome: no userId in store，無法新增收入交易')
    return
  }

  const body = {
    from_asset_id: null,
    to_asset_id,
    transaction_type,
    amount,
    fee: 0,
    from_account_id: null,
    to_account_id: authStore.userId,
    transaction_time: transaction_time || null,
    notes: notes || null,
    image: null,
  }

  try {
    const response: AxiosResponse<any> = await axios.post(API_BASE_URL, body)
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
  const authStore = useAuthStore()
  if (!authStore.userId) {
    console.error('addTransactionExpense: no userId in store，無法新增支出交易')
    return
  }

  const body = {
    from_asset_id,
    to_asset_id: null,
    transaction_type,
    amount,
    fee: 0,
    from_account_id: authStore.userId,
    to_account_id: null,
    transaction_time: transaction_time || null,
    notes: notes || null,
    image: null,
  }

  try {
    const response: AxiosResponse<any> = await axios.post(API_BASE_URL, body)
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
  const authStore = useAuthStore()
  if (!authStore.userId) {
    console.error('addTransactionInternalTransfer: no userId in store，無法新增內部轉帳交易')
    return
  }

  const body = {
    from_asset_id,
    to_asset_id,
    transaction_type,
    amount: balance,
    fee,
    from_account_id: authStore.userId,
    to_account_id: authStore.userId,
    transaction_time: transaction_time || null,
    notes: notes || null,
    image: null,
  }

  try {
    const response: AxiosResponse<any> = await axios.post(API_BASE_URL, body)
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

  try {
    const response: AxiosResponse<any> = await axios.post(API_BASE_URL, body)
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
    return response
  } catch (error) {
    console.error('Failed to parse user data or send request:', error)
  }
}
