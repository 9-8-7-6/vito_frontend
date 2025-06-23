<template>
  <button :class="['action-button', customClass]" @click="$emit('click')">
    <font-awesome-icon :icon="icon" />
  </button>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  /** Font Awesome icon (array or string) */
  icon: {
    type: [Array, String],
    required: true,
  },
  /** Optional extra CSS class */
  customClass: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['click'])
</script>

<style scoped>
.action-button {
  background-color: #d9534f;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
}
.action-button:hover {
  background-color: #c9302c;
}
</style>
