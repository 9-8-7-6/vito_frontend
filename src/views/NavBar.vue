<template>
  <nav ref="navRef" class="navbar">
    <!-- Left-aligned navigation links -->
    <div class="left-links">
      <!-- Always show homepage -->
      <router-link to="/" class="logo">Homepage</router-link>
    </div>

    <!-- Right-aligned dropdown for account-related actions -->
    <div class="nav-menu">
      <!-- Authenticated user-only links -->
      <button @click="toggleResource" class="menu-button">☰</button>
      <div v-show="showResources" class="dropdown resources">
        <router-link
          v-if="authStore.userId"
          to="/asset"
          class="dropdown-item"
          @click="showResources = false"
        >
          Asset
        </router-link>
        <router-link
          v-if="authStore.userId"
          to="/transaction"
          class="dropdown-item"
          @click="showResources = false"
        >
          Transaction
        </router-link>
        <router-link
          v-if="authStore.userId"
          to="/stock"
          class="dropdown-item"
          @click="showResources = false"
        >
          Stock
        </router-link>
        <router-link
          v-if="!authStore.userId"
          to="/register"
          class="dropdown-item"
          @click="showResources = false"
        >
          Register
        </router-link>
        <router-link
          v-if="!authStore.userId"
          to="/login"
          class="dropdown-item"
          @click="showResources = false"
        >
          Login
        </router-link>
        <router-link
          v-if="authStore.userId"
          to="/setting"
          class="dropdown-item"
          @click="showResources = false"
        >
          Setting
        </router-link>
        <button v-if="authStore.userId" @click="handleLogout" class="dropdown-item">Logout</button>
      </div>
      <div v-show="dropdownVisible" class="dropdown"></div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

// Access auth state and routing
const authStore = useAuthStore()
const router = useRouter()
const showResources = ref(false)
const dropdownVisible = ref(false)
const navRef = ref<HTMLElement | null>(null)

const toggleDropdown = () => {
  dropdownVisible.value = !dropdownVisible.value
  if (dropdownVisible.value) {
    showResources.value = false
  }
}

// Logout handler
const handleLogout = () => {
  authStore.logout() // Clear user state in Pinia
  router.push('/login') // Redirect to login page
  dropdownVisible.value = false
}

function toggleResource() {
  showResources.value = !showResources.value
  if (showResources.value) {
    dropdownVisible.value = false
  }
}

function handleClickOutside(e: MouseEvent) {
  if (navRef.value && !navRef.value.contains(e.target as Node)) {
    showResources.value = false
    dropdownVisible.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
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
  background: #444;
  border: 0.5px, solid, black;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
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
  padding: 0.5rem 0.75rem;
  color: #333;
  text-decoration: none;
  font-size: 0.9rem;
  transition: 0.2s;
}

.dropdown-item:hover {
  background-color: #f0f0f0;
}

.dropdown.resources {
  background-color: #434044;
  border: 1px solid #212222;
}

.dropdown.resources .dropdown-item {
  background: transparent;
  border: none;
  width: 100%;
  text-align: left;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
}

.dropdown.resources .dropdown-item:focus {
  outline: none;
}

.dropdown.resources .dropdown-item {
  color: #ecf0f1;
  transition: background 0.2s;
}

.dropdown.resources .dropdown-item:hover {
  background-color: #414344;
  color: #fff;
}

.dropdown.resources .dropdown-item + .dropdown-item {
  border-top: 1px solid #1a252f;
}

@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    align-items: stretch;
    padding: 10px;
  }

  .left-links {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 10px;
    justify-content: space-between;
  }
  .left-links .logo,
  .left-links .nav-link {
    flex: 1 1 48%;
    padding: 8px 0;
  }

  .nav-menu {
    width: 100%;
  }

  .dropdown {
    position: sticky;
    width: 100%;
    box-shadow: none;
    margin-top: 8px;
    border-radius: 4px;
  }
  .dropdown-item {
    padding: 12px;
  }
}
</style>
