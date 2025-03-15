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
    const url = `${API_BASE_URL}/asset`
    console.log(`Sending request for ${parsedUser.id} asset`)
    return axios.post(url, parsedUser)
  } catch (error) {
    console.error('Failed to parse user data or send request:', error)
  }
}
