<template>
  <div class="container">
    <div class="table-container">
      <!-- Asset table -->
      <table>
        <thead>
          <tr>
            <th>Asset Type</th>
            <th>Balance</th>
            <th>Last time updated</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <!-- Display paginated assets -->
          <tr v-for="(asset, index) in paginatedAssets" :key="asset.id">
            <!-- Asset type editing logic -->
            <td>
              <span
                v-if="editingTypeId !== asset.id"
                class="asset-type-button"
                @click="startEditingType(asset.id, asset.asset_type)"
              >
                {{ asset.asset_type }}
              </span>
              <input
                v-else
                class="asset-type-input"
                v-model="editedTypeValue"
                type="text"
                @keyup.enter="handleUpdateAssetType(asset.id, asset.balance)"
                @blur="cancelEditingType"
              />
            </td>

            <!-- Asset balance editing logic -->
            <td>
              <input
                v-if="editingId === asset.id"
                v-model="editedValue"
                type="number"
                @keyup.enter="handleUpdateAsset(asset.id, asset.asset_type)"
                @blur="cancelEditing"
              />
              <span
                v-else
                :class="{
                  profit: asset.balance > 0,
                  loss: asset.balance < 0,
                  neutral: asset.balance == 0,
                }"
                @click="startEditing(asset.id, asset.balance)"
              >
                {{ asset.balance > 0 ? '+' + asset.balance : asset.balance }}
              </span>
            </td>

            <td>{{ asset.updated_at }}</td>

            <!-- Delete button -->
            <td>
              <button class="action-button" @click="handleDeleteAsset(asset.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination controls -->
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">Pre</button>
      <span>{{ currentPage }} / {{ totalPages }} page</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      <input v-model.number="jumpToPage" type="number" min="1" :max="totalPages" />
      <button @click="goToPage">Jump to</button>
      <label>
        Per page：
        <select v-model="itemsPerPage" @change="currentPage = 1">
          <option :value="10">10</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
        </select>
      </label>
    </div>

    <!-- Create new asset section -->
    <button v-if="!showForm" @click="showForm = true" class="create-asset-button">
      Create New Asset
    </button>

    <!-- New asset form -->
    <div v-if="showForm" class="asset-form">
      <label for="asset_type">Asset Type:</label>
      <input id="asset_type" v-model="newAssetType" placeholder="Enter asset type" />
      <label for="balance">Balance:</label>
      <input id="balance" v-model="newBalance" type="number" placeholder="Enter balance" />
      <div class="button-group">
        <button @click="createAsset">Create Asset</button>
        <button @click="showForm = false" class="cancel-button">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { getAsset, addAsset, deleteAsset, updateAsset } from '../api/asset'

// State: Asset list and form inputs
const assets = ref([])
const newAssetType = ref('')
const newBalance = ref('')

// Editing state
const editingId = ref(null)
const editedValue = ref('')
const editingTypeId = ref(null)
const editedTypeValue = ref('')

// Form visibility toggle
const showForm = ref(false)

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)
const jumpToPage = ref(1)
const totalPages = computed(() => Math.ceil(assets.value.length / itemsPerPage.value))

// Fetch data from API
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

// Create asset API call
const createAsset = async () => {
  if (!newAssetType.value || newBalance.value === '') {
    alert(`Please enter both Asset Type and Balance!`)
    return
  }

  try {
    const response = await addAsset(newAssetType.value, parseFloat(newBalance.value))
    if (response && response.data) {
      assets.value.push(response.data)
      newAssetType.value = ''
      newBalance.value = ''
      showForm.value = false
    }
  } catch (error) {
    console.error('Error adding assets:', error)
  }
}

// Delete asset API call
const handleDeleteAsset = async (asset_id) => {
  try {
    await deleteAsset(asset_id)
    window.location.reload() // reload to update list
  } catch (error) {
    console.error('Error deleting asset:', error)
  }
}

// Edit balance logic
const startEditing = async (assetId, balance) => {
  editingId.value = assetId
  editedValue.value = balance
  await nextTick()
}

const handleUpdateAsset = async (asset_id, asset_type) => {
  if (editedValue.value === '') {
    alert('Please enter Balance!')
    return
  }

  try {
    const updatedFields = { balance: parseFloat(editedValue.value) }
    const response = await updateAsset(asset_id, updatedFields)
    if (response) window.location.reload()
  } catch (error) {
    console.error('Error updating asset balance:', error)
  } finally {
    editingId.value = null
  }
}

const cancelEditing = () => {
  editingId.value = null
}

// Edit asset type logic
const startEditingType = async (assetId, assetType) => {
  editingTypeId.value = assetId
  editedTypeValue.value = assetType
  await nextTick()
}

const handleUpdateAssetType = async (asset_id, balance) => {
  if (editedTypeValue.value.trim() === '') {
    alert('Please enter a valid Asset Type!')
    return
  }

  try {
    const updatedFields = { asset_type: editedTypeValue.value }
    const response = await updateAsset(asset_id, updatedFields)
    if (response) window.location.reload()
  } catch (error) {
    console.error('Error updating asset type:', error)
  } finally {
    editingId.value = null
  }
}

const cancelEditingType = () => {
  editingTypeId.value = null
}

// Pagination logic
const paginatedAssets = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return assets.value.slice(start, end)
})

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const goToPage = () => {
  if (jumpToPage.value >= 1 && jumpToPage.value <= totalPages.value) {
    currentPage.value = jumpToPage.value
  }
}

// Run on component mount
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
  width: 100%;
  border-collapse: collapse;
  margin: 20px auto;
  background-color: #1e1e1e;
  border-radius: 8px;
  overflow: hidden;
}

.table-container {
  max-height: 400px;
  overflow-y: auto;
  position: relative;
}

.table-container table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
  table-layout: fixed;
}

.table-container thead {
  top: 0;
  background-color: #333;
  z-index: 10;
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

.create-asset-button {
  margin-top: 20px;
}

button:hover {
  background-color: #0056b3;
}

th,
td {
  border: 1px solid #444;
  padding: 10px;
}

th {
  background-color: #333;
  color: white;
}

td {
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

.asset-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 400px;
  margin: 0 auto 20px auto;
  padding: 20px;
  background-color: #1e1e1e;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(255, 255, 255, 0.1);
}

.button-group {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 10px;
}

.cancel-button {
  background-color: #d9534f;
  padding: 10px 20px;
  border-radius: 5px;
  color: white;
  border: none;
  font-size: 16px;
  cursor: pointer;
}

.cancel-button:hover {
  background-color: #c9302c;
}

.profit {
  color: #00bfff;
  font-weight: bold;
}

.loss {
  color: #ff4d4f;
  font-weight: bold;
}

.neutral {
  color: white;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}

.pagination button {
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.pagination button:disabled {
  background-color: gray;
  cursor: not-allowed;
}

.pagination select,
.pagination input {
  padding: 5px;
  font-size: 16px;
  width: 60px;
}
</style>
