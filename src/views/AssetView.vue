<template>
  <div>
    <div>
      <label for="asset_type">Asset Type:</label>
      <input id="asset_type" v-model="newAssetType" placeholder="Enter asset type" />

      <label for="balance">Balance:</label>
      <input id="balance" v-model="newBalance" type="number" placeholder="Enter balance" />

      <button @click="createAsset">Create Asset</button>
    </div>

    <table>
      <thead>
        <tr>
          <th>Number</th>
          <th>Asset Type</th>
          <th>Balance</th>
          <th>Last time updated</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(asset, index) in assets" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ asset.asset_type }}</td>
          <td>{{ asset.balance }}</td>
          <td>{{ asset.updated_at }}</td>
          <td>
            <button @click="handleDeleteAsset(asset.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAsset, addAsset, deleteAsset } from '../api/asset'

const assets = ref([])
const newAssetType = ref('')
const newBalance = ref('')

const fetchAssets = async () => {
  try {
    const response = await getAsset()
    if (response && response.data) {
      assets.value = response.data
    } else {
      console.error('Invalid API response', response)
    }
  } catch (error) {
    console.error('Error fetching assets:', error)
  }
}

const createAsset = async () => {
  if (!newAssetType.value || newBalance.value === '') {
    alert(`Please enter both Asset Type and Balance! ${newAssetType.value}, ${newBalance.value}`)
    return
  }

  try {
    const response = await addAsset(newAssetType.value, parseFloat(newBalance.value))
    if (response && response.data) {
      window.location.reload()
      newAssetType.value = ''
      newBalance.value = ''
    } else {
      console.error('Invalid API response', response)
    }
  } catch (error) {
    console.error('Error adding assets:', error)
  }
}

const handleDeleteAsset = async (asset_id) => {
  try {
    const response = await deleteAsset(asset_id)
    window.location.reload()
  } catch (error) {
    console.error('Error deleting assets:', error)
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
