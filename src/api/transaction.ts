import axios from 'axios'
import { setCookie, getCookie, removeCookie } from 'typescript-cookie'

const API_BASE_URL = 'http://localhost:8000/transactions'

export const getTransaction = async () => {
  const userData = localStorage.getItem('user')

  if (!userData) {
    console.error("No 'user' data found in localstorage")
    return
  }

  try {
    const parsedUser: { id: string } = JSON.parse(userData)
    const url = `${API_BASE_URL}/${parsedUser.id}`
    const response = await axios.get(url)

    console.log(
      `Sending GET request to url ${url} for ${parsedUser.id} transaction, response is ${JSON.stringify(response, null, 2)}`,
    )

    return response
  } catch (error) {
    console.error('Failed to parse user data or send request:', error)
  }
}

export const addTransaction = async (transaction_type: string, balance: number) => {
  const userData = localStorage.getItem('user')

  if (!userData) {
    console.error("No 'user' data found in localstorage")
    return
  }

  try {
    const parsedUser: { id: string } = JSON.parse(userData)
    const url = API_BASE_URL
    const body = {
      account_id: parsedUser.id,
      transaction_type: transaction_type,
      balance: balance,
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
  transaction_type: string,
  balance: number,
) => {
  try {
    const url = `${API_BASE_URL}/${transaction_id}`
    const body = {
      transaction_type: transaction_type,
      balance: balance,
    }

    const response = await axios.put(url, body)

    console.log(
      `Sending PUT request to url ${url} for ${transaction_id} transaction, response: ${JSON.stringify(response, null, 2)}`,
    )

    return response
  } catch (error) {
    console.error('Failed to parse user data or send request:', error)
  }
}
