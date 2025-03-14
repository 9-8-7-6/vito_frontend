<template>
  <div class="container">
    <form @submit.prevent="handleRegister">
      <input v-model="username" type="text" placeholder="Username" required />
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
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
    alert('Register successfully！Please login')
    router.push('/login')
  } catch (error) {
    console.error(error)

    const errorMessage = error.response?.data?.message || error.message || 'Unknown Error'

    alert(`Register fail，Please check the messaga you type\nError messages: ${errorMessage}`)
  }
}
</script>

<style></style>
