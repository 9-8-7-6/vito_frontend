<template>
  <nav class="navbar">
    <router-link to="/" class="logo">Homepage</router-link>

    <div class="nav-links">
      <router-link v-if="!authStore.user" to="/login">Login</router-link>
      <router-link v-if="!authStore.user" to="/register">Register</router-link>

      <span v-if="authStore.user" class="user-info">Hello, {{ authStore.user.username }}</span>
      <button v-if="authStore.user" @click="handleLogout">Logout</button>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  window.location.reload()
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #333;
  color: white;
}

.nav-links {
  display: flex;
  gap: 15px;
}

.nav-links a,
.user-info,
button {
  color: white;
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.nav-links button:hover {
  color: #f00;
}
</style>
