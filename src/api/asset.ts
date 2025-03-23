import axios from 'axios'

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/assets`

export const getAsset = async () => {
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
      `Sending GET request to url ${url} for ${parsedUser.id} asset, response is ${JSON.stringify(response, null, 2)}`,
    )

    return response
  } catch (error) {
    console.error('Failed to parse user data or send request:', error)
  }
}

export const addAsset = async (asset_type: string, balance: number) => {
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
      asset_type: asset_type,
      balance: balance,
    }

    const response = await axios.post(url, body)

    console.log(
      `Sending post request to url ${url} for ${parsedUser.id} asset, response is ${JSON.stringify(response, null, 2)}`,
    )

    return response
  } catch (error) {
    console.error('Failed to parse user data or send request:', error)
  }
}

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
