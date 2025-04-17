<template>
  <div class="container">
    <!-- Login form wrapper -->
    <form @submit.prevent="handleLogin">
      <!-- Username input -->
      <div class="form-group">
        <label for="username" class="label">Username</label>
        <input v-model="username" type="username" placeholder="Username" required />
      </div>

      <!-- Password input -->
      <div class="form-group">
        <label for="username" class="label">Password</label>
        <input v-model="password" type="password" placeholder="Password" required />
      </div>

      <!-- Submit button -->
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth' // Pinia auth store
import { useRouter } from 'vue-router' // Router for navigation

// Store and router initialization
const authStore = useAuthStore()
const router = useRouter()

// Form field state
const username = ref('')
const password = ref('')

// Login handler
const handleLogin = async () => {
  try {
    // Attempt to log in via the store
    await authStore.login({ username: username.value, password: password.value })
    // Redirect to home if successful
    router.push('/')
  } catch (error) {
    // Show an alert with error details
    console.error('Login failed:', error)
    const errorMessage = error.message || 'Unknown Error'
    alert(`Login failed. Please check your credentials.\nError: ${errorMessage}`)
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
