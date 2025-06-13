<template>
  <header>
    <div class="wrapper">
      <mark>
        <em>
          <p style="color: gainsboro; font-size: 200%">
            Keep grinding!<br />
            Your life can change in one year!
          </p>
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
</style>
