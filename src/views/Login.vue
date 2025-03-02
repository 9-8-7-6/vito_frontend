<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../api'

const username = ref('')
const password = ref('')
const errorMessage = ref('')
const router = useRouter()

const handleLogin = async () => {
    try {
        const data = await login(username.value, password.value)
        
        localStorage.setItem('access_token', data.access)
        localStorage.setItem('refresh_token', data.refresh)

        router.push('/')
    } catch (error) {
        errorMessage.value = error.error || "Login failed"
    }
}
</script>

<template>
  <div class="login-container">
    <h2>Login</h2>
    <input v-model="username" placeholder="Username" />
    <input v-model="password" type="password" placeholder="Password" />
    <button @click="handleLogin">Login</button>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  text-align: center;
}
input {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 10px;
}
button {
  width: 100%;
  padding: 10px;
  background-color: blue;
  color: white;
  border: none;
}
.error {
  color: red;
}
</style>
