<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue'
const msg = ref("This is a dynamic message")
const rawHtml = ref("<h1>This is HTML content</h1>") // 定義 rawHtml
</script>

<template>
  <header>
    <div class="wrapper">
      <span>{{ msg }}</span>
      <p>{{ rawHtml }}</p>
      <p><span v-html="rawHtml"></span></p>
      Using text interpolation: <span style="color: red">This should be red.</span>
    </div>
  </header>

  <RouterView />
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
