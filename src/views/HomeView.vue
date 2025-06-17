<template>
  <header>
    <div class="wrapper">
      <mark>
        <em>
          <p class="quote">Keep grinding!</p>
          <p class="quote">Your life can change in one year!</p>
        </em>
      </mark>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>
<style scoped>
.wrapper {
  text-align: center;
  padding: 20px;
}

.quote {
  color: gainsboro;
  font-size: 200%;
}
</style>
