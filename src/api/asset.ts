import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

export interface Userid {
  id: string
}

export const assetRequest = async () => {
  const userData = localStorage.getItem('user')

  if (!userData) {
    console.error("No 'user' data found in localstorage")
    return
  }

  try {
    const parsedUser: Userid = JSON.parse(userData)
    const url = `${API_BASE_URL}/assets/${parsedUser.id}`
    const response = await axios.get(url)
    console.log(
      `Sending request to url ${url} for ${parsedUser.id} asset, response is ${JSON.stringify(response, null, 2)}`,
    )
    return response
  } catch (error) {
    console.error('Failed to parse user data or send request:', error)
  }
}
