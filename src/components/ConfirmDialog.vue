<template>
  <div class="overlay" @click.self="cancel">
    <div class="dialog">
      <h3 class="title">Confirm Delete ?</h3>
      <div class="actions">
        <button class="btn confirm" @click="confirm">Delete</button>
        <button class="btn cancel" @click="cancel">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue'
const emit = defineEmits(['confirm', 'cancel'])

const confirm = () => emit('confirm')
const cancel = () => emit('cancel')
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}
.dialog {
  background-color: #1e1e1e;
  padding: 20px;
  border-radius: 8px;
  max-width: 320px;
  width: 90%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  text-align: center;
}
.title {
  margin: 0 0 10px;
  color: #fff;
}
.message {
  margin-bottom: 20px;
  color: #ccc;
}
.actions {
  display: flex;
  justify-content: space-around;
}
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}
.btn.cancel {
  background-color: #444;
  color: #ddd;
}
.btn.cancel:hover {
  background-color: #555;
}
.btn.confirm {
  background-color: #d9534f;
  color: #fff;
}
.btn.confirm:hover {
  background-color: #c9302c;
}
</style>
