<template>
  <div>
    <h1>Asset</h1>
    <table>
      <thead>
        <tr>
          <th>Asset Type</th>
          <th>Balance</th>
          <th>Last time updated</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(asset, index) in assets" :key="index">
          <td>{{ asset.asset_type }}</td>
          <td>{{ asset.balance }}</td>
          <td>{{ asset.updated_at }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { assetRequest } from '../api/asset'

const assets = ref([])

const fetchAssets = async () => {
  try {
    const response = await assetRequest()
    if (response && response.data) {
      assets.value = response.data
    } else {
      console.error('Invalid API response', response)
    }
  } catch (error) {
    console.error('Error fetching assets:', error)
  }
}

onMounted(fetchAssets)
</script>
<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #333;
  color: white;
}

td {
  background-color: #2c2b2b;
}
</style>
