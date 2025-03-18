<template>
  <div class="container">
    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label for="username" class="label">Username</label>
        <input v-model="username" type="text" placeholder="Username" required />
      </div>

      <div class="form-group">
        <label for="email" class="label">Email</label>
        <input v-model="email" type="email" placeholder="Email" required />
      </div>

      <div class="form-group">
        <label for="password" class="label">Password</label>
        <input v-model="password" type="password" placeholder="Password" required />
      </div>

      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { registerUser } from '@/api/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const email = ref('')
const password = ref('')

const handleRegister = async () => {
  try {
    await registerUser({
      username: username.value,
      email: email.value,
      password: password.value,
    })
    alert('Register successfully! Please login')
    router.push('/login')
  } catch (error) {
    console.error(error)
    const errorMessage = error.response?.data?.message || error.message || 'Unknown Error'
    alert(`Register failed. Please check your input.\nError message: ${errorMessage}`)
  }
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-group {
  display: flex;
  flex-direction: column;
}

input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

button {
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}

.label {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}
</style>
