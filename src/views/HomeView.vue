<template>
  <div class="container">
    <h2>Welcome to the homepage</h2>
    <p v-if="authStore.user">您好，{{ authStore.user.email }}</p>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { AuthCheck } from '../api/auth'

const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
  window.location.reload()
}
</script>
