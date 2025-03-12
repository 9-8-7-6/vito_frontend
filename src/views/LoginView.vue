<template>
  <div class="container">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="username" type="username" placeholder="Username" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
    <p><router-link to="/register">Register</router-link></p>
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
  await authStore.login({ username: username.value, password: password.value })
  router.push('/')
}
</script>

<style>
.container {
  max-width: 300px;
  margin: auto;
  text-align: center;
}
input {
  display: block;
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
}
button {
  width: 100%;
  padding: 8px;
  background-color: blue;
  color: white;
}
</style>
