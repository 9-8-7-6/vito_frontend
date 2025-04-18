<template>
  <nav class="navbar">
    <!-- Left-aligned navigation links -->
    <div class="left-links">
      <!-- Always show homepage -->
      <router-link to="/" class="logo">Homepage</router-link>

      <!-- Authenticated user-only links -->
      <router-link v-if="authStore.user" to="/asset" class="nav-link">Asset</router-link>
      <router-link v-if="authStore.user" to="/transaction" class="nav-link"
        >Transaction</router-link
      >
      <router-link v-if="authStore.user" to="/stock" class="nav-link">Stock</router-link>
    </div>

    <!-- Right-aligned dropdown for account-related actions -->
    <div class="nav-menu">
      <button @click="toggleDropdown" class="menu-button">Account</button>

      <!-- Dropdown menu shows/hides based on `dropdownVisible` -->
      <div v-show="dropdownVisible" class="dropdown">
        <!-- Guest-only links -->
        <router-link v-if="!authStore.user" to="/register" class="dropdown-item"
          >Register</router-link
        >
        <router-link v-if="!authStore.user" to="/login" class="dropdown-item">Login</router-link>

        <!-- Logged-in user links -->
        <button v-if="authStore.user" @click="handleLogout" class="dropdown-item">Logout</button>
        <router-link v-if="authStore.user" to="/setting" class="dropdown-item">Setting</router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth' // Pinia store for auth state
import { useRouter } from 'vue-router' // Router for navigation

// Access auth state and routing
const authStore = useAuthStore()
const router = useRouter()

// Dropdown menu visibility toggle
const dropdownVisible = ref(false)
const toggleDropdown = () => {
  dropdownVisible.value = !dropdownVisible.value
}

// Logout handler
const handleLogout = () => {
  authStore.logout() // Clear user state in Pinia
  router.push('/login') // Redirect to login page
  window.location.reload() // Force page reload to clear session state
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
