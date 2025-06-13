<script setup>
import { useRoute } from 'vue-router'
import NavBar from '@/views/NavBar.vue'
const route = useRoute()
</script>

<template>
  <NavBar />
  <router-view />
</template>

<style scoped>
a {
  background-color: transparent;
  text-decoration: none;
}

a:link {
  color: green;
}

a:visited {
  color: pink;
}

a:hover {
  color: red;
  text-decoration: underline;
}

a:active {
  color: yellow;
  text-decoration: underline;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
}

.custom-title {
  font-size: 60px;
  color: bisque;
}
</style>
