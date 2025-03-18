<template>
  <div class="container">
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="username" class="label">Username</label>
        <input v-model="username" type="username" placeholder="Username" required />
      </div>
      <div class="form-group">
        <label for="username" class="label">password</label>
        <input v-model="password" type="password" placeholder="Password" required />
      </div>
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const username = ref('')
const password = ref('')

const handleLogin = async () => {
  const success = await authStore.login({ username: username.value, password: password.value })
  if (success) {
    console.log('login successfully')
    router.push('/')
  } else {
    console.error('Login failed:', error)
    alert('Login failed. Please check your username and password.')
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
