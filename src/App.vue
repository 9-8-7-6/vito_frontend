<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue'
</script>

<template>
  <header>
    <div class="wrapper">
      <h1 class="custom-title">Vito</h1>
      <p style="color:gainsboro">Keep grinding !<br> your life can change in one year!</p>
      <span style="font-size: 20px; color: turquoise">Finance is the key to freedom!</span>
      <br><img src="../rich_man.png" alt="rich man" width="200" height="200">
    </div>
  </header>
</template>

<style scoped>
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
