<script setup>
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'

const router = useRouter()
const isAuthenticated = computed(() => !!localStorage.getItem('access_token'))

const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    router.push('/login')
}
</script>

<template>
  <header>
    <div class="wrapper">
      <h1 class="custom-title">Vito</h1>
      <mark><em><p style="color:gainsboro; font-size:200%;">Keep grinding !<br> your life can change in one year!</p></em></mark>
      <span style="font-size: 20px; color: turquoise; padding: 5px;">Finance is the key to freedom!</span>
      <div><a href="mailto:vito.lin.company@gmail.com">Send email</a></div>
    </div>
  </header>
  <router-view />
</template>

<style scoped>

a:link {
  color: green;
  background-color: transparent;
  text-decoration: none;
}

a:visited {
  color: pink;
  background-color: transparent;
  text-decoration: none;
}

a:hover {
  color: red;
  background-color: transparent;
  text-decoration: underline;
}

a:active {
  color: yellow;
  background-color: transparent;
  text-decoration: underline;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

.custom-title {
  font-size: 60px;
  color: bisque;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}
</style>
