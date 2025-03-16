<template>
  <div class="container">
    <div class="asset-form">
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
          <td>
            <button
              v-if="editingTypeId !== asset.id"
              class="asset-type-button"
              @click="startEditingType(asset.id, asset.asset_type)"
            >
              {{ asset.asset_type }}
            </button>
            <input
              v-else
              class="asset-type-input"
              v-model="editedTypeValue"
              type="text"
              @keyup.enter="handleUpdateAssetType(asset.id, asset.balance)"
              @blur="cancelEditingType"
              ref="typeInput"
            />
          </td>
          <td>
            <button v-if="editingId !== asset.id" @click="startEditing(asset.id, asset.balance)">
              {{ asset.balance }}
            </button>
            <input
              v-else
              v-model="editedValue"
              type="number"
              @keyup.enter="handleUpdateAsset(asset.id, asset.asset_type)"
              @blur="cancelEditing"
              ref="balanceInput"
            />
          </td>
          <td>{{ asset.updated_at }}</td>
          <td>
            <button class="action-button" @click="handleDeleteAsset(asset.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { getAsset, addAsset, deleteAsset, updateAsset } from '../api/asset'

const assets = ref([])
const newAssetType = ref('')
const newBalance = ref('')

const editingId = ref(null)
const editedValue = ref('')
const balanceInput = ref(null)

const editingTypeId = ref(null)
const editedTypeValue = ref('')
const typeInput = ref(null)

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

const startEditing = async (assetId, balance) => {
  editingId.value = assetId
  editedValue.value = balance

  await nextTick()
}

const handleUpdateAsset = async (asset_id, asset_type) => {
  if (editedValue.value === '') {
    alert(`Please enter Balance! ${newBalance.value}`)
    return
  }

  try {
    const response = await updateAsset(asset_id, asset_type, parseFloat(editedValue.value))
    if (response) {
      window.location.reload()
    } else {
      console.error('Invalid API response', response)
    }
  } catch (error) {
    console.error('Error adding assets:', error)
  } finally {
    editingId.value = null
  }
}

const cancelEditing = () => {
  editingId.value = null
}

const startEditingType = async (assetId, assetType) => {
  editingTypeId.value = assetId
  editedTypeValue.value = assetType

  await nextTick()
}

const handleUpdateAssetType = async (asset_id, balance) => {
  if (editedTypeValue.value.trim() === '') {
    alert(`Please enter a valid Asset Type!`)
    return
  }

  try {
    const response = await updateAsset(asset_id, editedTypeValue.value, balance)
    if (response) {
      window.location.reload()
    } else {
      console.error('Invalid API response', response)
    }
  } catch (error) {
    console.error('Error adding assets:', error)
  } finally {
    editingId.value = null
  }
}

const cancelEditingType = () => {
  editingTypeId.value = null
}

onMounted(fetchAssets)
</script>
<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

table {
  width: 80%;
  border-collapse: collapse;
  margin: 20px auto;
  background-color: #1e1e1e;
  border-radius: 8px;
  overflow: hidden;
}

label {
  font-size: 16px;
  margin-bottom: 5px;
}
input {
  width: 250px;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #444;
  border-radius: 5px;
  background-color: #333;
  color: white;
}
button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}
button:hover {
  background-color: #0056b3;
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
  padding: 10px;
}

td {
  border: 1px solid #444;
  padding: 10px;
  text-align: center;
}

.action-button {
  background-color: #d9534f;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
}

.action-button:hover {
  background-color: #c9302c;
}

.asset-type-button,
.asset-type-input {
  min-width: 100px;
  width: auto;
  padding: 8px 12px;
  text-align: center;
}

.asset-type-input {
  border: 1px solid #444;
  border-radius: 5px;
  background-color: #333;
  color: white;
}
</style>
