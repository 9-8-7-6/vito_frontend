<template>
  <div class="container">
    <h2>Welcome to the homepage</h2>
    <p v-if="authStore.user">您好，{{ authStore.user.email }}</p>
    <button v-if="authStore.user" @click="handleLogout">Logout</button>
    <router-link v-else to="/login">Login</router-link>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
};
</script>