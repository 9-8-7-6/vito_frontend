<template>
  <div class="container">
    <h2>Welcome to the homepage</h2>
    <p v-if="authStore.user">Hello ,{{ authStore.user.email }}</p>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>
