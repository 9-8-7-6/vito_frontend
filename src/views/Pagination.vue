<template>
  <div class="pagination">
    <div class="pagination-controls">
      <button @click="prevPage" :disabled="currentPage === 1">Pre</button>
      <span>{{ currentPage }}/{{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages || totalPages === 0">
        Next
      </button>
    </div>

    <label>
      Per page：
      <select v-model.number="localItemsPerPage">
        <option :value="10">10</option>
        <option :value="50">50</option>
        <option :value="100">100</option>
      </select>
    </label>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const { currentPage, totalPages, itemsPerPage } = defineProps<{
  currentPage: number
  totalPages: number
  itemsPerPage: number
}>()

const emit = defineEmits<{
  (e: 'update:currentPage', value: number): void
  (e: 'update:itemsPerPage', value: number): void
}>()

const localItemsPerPage = ref<number>(itemsPerPage)

watch(localItemsPerPage, (val) => {
  emit('update:itemsPerPage', val)
  emit('update:currentPage', 1)
})

watch(
  () => itemsPerPage,
  (val) => {
    localItemsPerPage.value = val
  },
  { immediate: true },
)

function prevPage() {
  if (currentPage > 1) emit('update:currentPage', currentPage - 1)
}

function nextPage() {
  if (currentPage < totalPages) emit('update:currentPage', currentPage + 1)
}
</script>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.pagination button {
  padding: 5px 10px;
  border-radius: 5px;
}

.pagination button:disabled {
  background-color: gray;
  cursor: not-allowed;
}

.pagination select {
  padding: 5px;
  font-size: 16px;
  width: 60px;
}
</style>
