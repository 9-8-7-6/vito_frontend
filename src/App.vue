<script setup>
import { useRoute } from 'vue-router'
import NavBar from '@/views/NavBar.vue'

const route = useRoute()
</script>

<template>
  <NavBar />
  <header v-if="route.path === '/'">
    <div class="wrapper">
      <h1 class="custom-title">Vito</h1>
      <mark
        ><em
          ><p style="color: gainsboro; font-size: 200%">
            Keep grinding !<br />
            your life can change in one year!
          </p></em
        ></mark
      >
      <span style="font-size: 20px; color: turquoise; padding: 5px"
        >Finance is the key to freedom!</span
      >
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

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
}

.custom-title {
  font-size: 60px;
  color: bisque;
}

.wrapper {
  text-align: center;
  padding: 20px;
}
</style>
