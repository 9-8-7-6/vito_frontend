<template>
  <div class="container">
    <!-- Error message above form -->
    <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

    <!-- Login form wrapper -->
    <form @submit.prevent="handleLogin">
      <!-- Username input -->
      <div class="form-group">
        <label for="username" class="label">Username</label>
        <input v-model="username" id="username" type="text" placeholder="Username" required />
      </div>

      <!-- Password input with press-and-hold to show toggle -->
      <div class="form-group password-group">
        <label for="password" class="label">Password</label>
        <div class="password-wrapper">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            id="password"
            placeholder="Password"
            required
          />
          <button
            type="button"
            class="toggle-password"
            @mousedown="showPassword = true"
            @mouseup="showPassword = false"
            @mouseleave="showPassword = false"
            @touchstart.prevent="showPassword = true"
            @touchend="showPassword = false"
          >
            <font-awesome-icon :icon="['fas', 'eye']" />
          </button>
        </div>
      </div>

      <!-- Submit button -->
      <button type="submit" class="btn-submit">Login</button>

      <div class="action-section">
        <div class="action-links">
          <router-link to="/register" class="link-text">Register</router-link>
          <router-link to="/forgot-password" class="link-text">Forget Password</router-link>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

// Store and router initialization
const authStore = useAuthStore()
const router = useRouter()

// Form field state
const username = ref('')
const password = ref('')
const errorMessage = ref('')

// Show password when pressing button
const showPassword = ref(false)

// Login handler
const handleLogin = async () => {
  // Clear previous error
  errorMessage.value = ''
  try {
    const success = await authStore.login({ username: username.value, password: password.value })
    if (success) {
      router.push('/')
    } else {
      errorMessage.value = 'Invalid username or password.'
    }
  } catch (error) {
    console.error('Login failed:', error)
    errorMessage.value = 'An error occurred. Please try again later.'
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.error-msg {
  width: 320px;
  margin-bottom: 16px;
  padding: 10px;
  background-color: #ffe6e6;
  color: #cc0000;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  border: 1px solid #ff4d4d;
  border-radius: 4px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 320px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.password-group {
  position: relative;
}
.password-wrapper {
  position: relative;
}

.password-wrapper {
  position: relative;
}
.password-wrapper input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  padding-right: 2.5rem;
}

.toggle-password {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  color: #6a6363;
  padding: 2px 4px;
}
.toggle-password:active {
  color: black;
}

input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

.btn-submit {
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-submit:hover {
  background-color: #0056b3;
}

.label {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.action-section {
  margin-top: 10px;
}

.action-links {
  display: flex;
  justify-content: space-between;
}

.link-text {
  font-size: 14px;
  color: #30363d;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.2s;
}

.link-text:hover {
  color: #0056b3;
}
</style>
