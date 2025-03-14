<template>
  <nav class="navbar">
    <router-link to="/" class="logo">Homepage</router-link>

    <div class="nav-menu">
      <button @click="toggleDropdown" class="menu-button">Account</button>

      <div v-show="dropdownVisible" class="dropdown">
        <router-link v-if="!authStore.user" to="/register" class="dropdown-item"
          >Register</router-link
        >
        <router-link v-if="!authStore.user" to="/login" class="dropdown-item">Login</router-link>
        <button v-if="authStore.user" @click="handleLogout" class="dropdown-item">Logout</button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const dropdownVisible = ref(false)

const toggleDropdown = () => {
  dropdownVisible.value = !dropdownVisible.value
}

const handleLogout = () => {
  authStore.logout()
  window.location.reload()
  dropdownVisible.value = false
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

.nav-menu {
  position: relative;
}

.menu-button {
  background-color: #444;
  color: white;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 5px;
}

.menu-button:hover {
  background-color: #555;
}

.dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  min-width: 120px;
}

.dropdown-item {
  padding: 8px 12px;
  text-decoration: none;
  color: black;
  display: block;
  border: none;
  background: none;
  text-align: left;
  width: 100%;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f0f0f0;
}
</style>
