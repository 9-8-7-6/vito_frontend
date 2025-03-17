<template>
  <nav class="navbar">
    <div class="left-links">
      <router-link to="/" class="logo">Homepage</router-link>
      <router-link v-if="authStore.user" to="/asset" class="nav-link">Asset</router-link>
      <router-link v-if="authStore.user" to="/transaction" class="nav-link"
        >Transaction</router-link
      >
    </div>

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
  router.push('/login')
  window.location.reload()
  dropdownVisible.value = false
}
</script>

<style scoped>
.navbar {
  font-family: 'Helvetica Neue', Arial, 'PingFang TC', 'Microsoft JhengHei', sans-serif;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #333;
  color: white;
  z-index: 999;
}

.left-links {
  display: flex;
  align-items: center;
  gap: 20px;
}

.logo {
  font-weight: bold;
  font-size: 18px;
  color: #fff;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s;
}

.logo:hover {
  color: #ccc;
}

.nav-link {
  font-size: 16px;
  color: #fff;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #ccc;
}

.nav-menu {
  position: relative;
}

.menu-button {
  background-color: #444;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  font-size: 16px;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.2s;
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
  color: #333;
  border: none;
  background: none;
  text-align: left;
  width: 100%;
  cursor: pointer;
  font-size: 16px;
  margin: 2px 0;
}

.dropdown-item:hover {
  background-color: #f0f0f0;
}
</style>
