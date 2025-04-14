import axios from 'axios'
import { setCookie, getCookie, removeCookie } from 'typescript-cookie'
import { formatFieldDate } from '../utils/format'

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/transactions`

export const getTransactionsByUserId = async () => {
  const userData = localStorage.getItem('user')

  if (!userData) {
    console.error("No 'user' data found in localstorage")
    return
  }

  try {
    const parsedUser: { id: string } = JSON.parse(userData)
    const url = `${API_BASE_URL}/account/${parsedUser.id}`
    const response = await axios.get(url)

    if (response && response.data) {
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

export const addTransactionIncome = async (
  transaction_type: string,
  amount: number,
  to_asset_id: string,
  transaction_time: string,
  notes: string,
) => {
  const userData = localStorage.getItem('user')

  if (!userData) {
    console.error("No 'user' data found in localstorage")
    return
  }

  try {
    const parsedUser: { id: string } = JSON.parse(userData)
    const url = API_BASE_URL
    const body = {
      from_asset_id: null,
      to_asset_id: to_asset_id,
      transaction_type: transaction_type,
      amount: amount,
      fee: 0,
      from_account_id: null,
      to_account_id: parsedUser.id,
      transaction_time: transaction_time || null,
      notes: notes || null,
      image: null,
    }

    const response = await axios.post(url, body)

    console.log(
      `Sending POST request to url ${url} for ${parsedUser.id} transaction, response is ${JSON.stringify(response, null, 2)}`,
    )

    return response
  } catch (error) {
    console.error('Failed to parse user data or send request:', error)
  }
}

export const addTransactionExpense = async (
  transaction_type: string,
  amount: number,
  from_asset_id: string,
  transaction_time: string,
  notes: string,
) => {
  const userData = localStorage.getItem('user')

  if (!userData) {
    console.error("No 'user' data found in localstorage")
    return
  }

  try {
    const parsedUser: { id: string } = JSON.parse(userData)
    const url = API_BASE_URL
    const body = {
      from_asset_id: from_asset_id,
      to_asset_id: null,
      transaction_type: transaction_type,
      amount: amount,
      fee: 0,
      from_account_id: parsedUser.id,
      to_account_id: null,
      transaction_time: transaction_time || null,
      notes: notes || null,
      image: null,
    }

    const response = await axios.post(url, body)

    console.log(
      `Sending post request to url ${url} for ${parsedUser.id} transaction, response is ${JSON.stringify(response, null, 2)}`,
    )

    return response
  } catch (error) {
    console.error('Failed to parse user data or send request:', error)
  }
}

export const addTransactionInternalTransfer = async (
  transaction_type: string,
  balance: number,
  fee: number,
  from_asset_id: string,
  to_asset_id: String,
  transaction_time: string,
  notes: string,
) => {
  const userData = localStorage.getItem('user')

  if (!userData) {
    console.error("No 'user' data found in localstorage")
    return
  }

  try {
    const parsedUser: { id: string } = JSON.parse(userData)
    const url = API_BASE_URL
    const body = {
      from_asset_id: from_asset_id,
      to_asset_id: to_asset_id,
      transaction_type: transaction_type,
      amount: balance,
      fee: fee,
      from_account_id: parsedUser.id,
      to_account_id: parsedUser.id,
      transaction_time: transaction_time,
      notes: notes || null,
      image: null,
    }

    const response = await axios.post(url, body)

    console.log(
      `Sending post request to url ${url} for ${parsedUser.id} transaction, response is ${JSON.stringify(response, null, 2)}`,
    )

    return response
  } catch (error) {
    console.error('Failed to parse user data or send request:', error)
  }
}

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
  const userData = localStorage.getItem('user')

  if (!userData) {
    console.error("No 'user' data found in localstorage")
    return
  }

  try {
    const parsedUser: { id: string } = JSON.parse(userData)
    const url = API_BASE_URL
    const body = {
      from_asset_id: from_asset_id,
      to_asset_id: to_asset_id,
      transaction_type: transaction_type,
      amount: balance,
      fee: fee,
      from_account_id: from_account_id,
      to_account_id: to_account_id,
      transaction_time: transaction_time,
      notes: notes || null,
      image: null,
    }

    const response = await axios.post(url, body)

    console.log(
      `Sending post request to url ${url} for ${parsedUser.id} transaction, response is ${JSON.stringify(response, null, 2)}`,
    )

    return response
  } catch (error) {
    console.error('Failed to parse user data or send request:', error)
  }
}

export const deleteTransaction = async (transaction_id: string) => {
  try {
    const url = `${API_BASE_URL}/${transaction_id}`
    const response = await axios.delete(url)

    console.log(
      `Sending DELETE request to url ${url} for ${transaction_id} transaction, response: ${JSON.stringify(response, null, 2)}`,
    )

    return response
  } catch (error) {
    console.error('Failed to parse user data or send request:', error)
  }
}

export const updateTransaction = async (
  transaction_id: string,
  updatedFields: Record<string, any>,
) => {
  try {
    const url = `${API_BASE_URL}/${transaction_id}`

    const response = await axios.patch(url, updatedFields)

    console.log(
      `Sending PATCH request to url ${url} for ${transaction_id} transaction, response: ${JSON.stringify(response, null, 2)}`,
    )

    return response
  } catch (error) {
    console.error('Failed to parse user data or send request:', error)
  }
}
