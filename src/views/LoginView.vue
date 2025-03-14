<template>
  <div class="container">
    <form @submit.prevent="handleLogin">
      <input v-model="username" type="username" placeholder="Username" required />
      <input v-model="password" type="password" placeholder="Password" required />
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
