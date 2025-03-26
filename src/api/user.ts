import axios from 'axios'

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/users`

export const getUserData = async () => {
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
      `Sending GET request to url ${url} for ${parsedUser.id} user, response is ${JSON.stringify(response, null, 2)}`,
    )

    return response
  } catch (error) {
    console.error('Failed to parse user data or send request:', error)
  }
}

export const updateUserData = async (user_id: string, fieldsToUpdate: Record<string, any>) => {
  try {
    const url = `${API_BASE_URL}/${user_id}`

    const response = await axios.patch(url, fieldsToUpdate)

    console.log(
      `Sending PATCH request to url ${url} for ${user_id} user, response: ${JSON.stringify(response, null, 2)}`,
    )

    return response
  } catch (error) {
    console.error('Failed to parse user data or send request:', error)
  }
}
