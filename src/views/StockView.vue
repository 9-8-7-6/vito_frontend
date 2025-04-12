<template>
  <div class="container">
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Stock</th>
            <th>Average Price</th>
            <th>Current Price</th>
            <th>Quantity</th>
            <th>Total Cost</th>
            <th>Current Value</th>
            <th>Profit / Loss</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in paginatedStockHoldings" :key="item.id">
            <td>{{ `${item.ticker_symbol} (${item.company_name})` }}</td>

            <td>
              <input
                v-if="editingPriceId === item.id"
                v-model="editedAveragePrice"
                type="number"
                @keyup.enter="handleUpdateHolding(item.id)"
                @blur="cancelEditing"
              />
              <span
                v-else
                class="editable-button"
                :class="{
                  profit:
                    item.current_price &&
                    item.quantity * item.current_price - item.quantity * item.average_price >= 0,
                  loss:
                    item.current_price &&
                    item.quantity * item.current_price - item.quantity * item.average_price < 0,
                }"
                @click="startEditingPrice(item.id, item.average_price)"
              >
                {{
                  item.current_price
                    ? item.quantity * item.current_price - item.quantity * item.average_price >= 0
                      ? '+' + Number(item.average_price).toFixed(2)
                      : '-' + Number(item.average_price).toFixed(2)
                    : Number(item.average_price).toFixed(2)
                }}
              </span>
            </td>

            <td>{{ item.current_price ?? 'N/A' }}</td>

            <td>
              <input
                v-if="editingQuantityId === item.id"
                v-model="editedQuantity"
                type="number"
                @keyup.enter="handleUpdateHolding(item.id)"
                @blur="cancelEditing"
              />
              <span
                v-else
                class="editable-button"
                @click="startEditingQuantity(item.id, item.quantity)"
              >
                {{ Number(item.quantity).toFixed(0) }}
              </span>
            </td>

            <td>{{ (item.quantity * item.average_price).toFixed(2) }}</td>
            <td>
              {{ item.current_price ? (item.quantity * item.current_price).toFixed(2) : 'N/A' }}
            </td>

            <td>
              <span
                :class="{
                  profit:
                    item.current_price &&
                    item.quantity * item.current_price - item.quantity * item.average_price >= 0,
                  loss:
                    item.current_price &&
                    item.quantity * item.current_price - item.quantity * item.average_price < 0,
                }"
              >
                {{
                  item.current_price
                    ? (() => {
                        const cost = item.quantity * item.average_price
                        const value = item.quantity * item.current_price
                        const profit = value - cost
                        const percent = cost !== 0 ? ((profit / cost) * 100).toFixed(2) : '0.00'
                        return (profit >= 0 ? '+' : '') + profit.toFixed(2) + ` (${percent}%)`
                      })()
                    : 'N/A'
                }}
              </span>
            </td>

            <td>
              <button class="action-button" @click="handleDeleteHolding(item.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
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

    <button v-if="!showForm" @click="showForm = true" class="create-asset-button">
      Create New Stock Holding
    </button>

    <div v-if="showForm" class="asset-form">
      <label for="country">Country:</label>
      <select id="country" v-model="newCountry">
        <option disabled value="" hidden>Select Country</option>
        <option value="TW">Taiwan</option>
      </select>

      <label for="ticker_symbol">Ticker Symbol:</label>
      <input id="ticker_symbol" v-model="newTickerSymbol" placeholder="e.g., AAPL" />

      <label for="average_price">Average Price:</label>
      <input
        id="average_price"
        v-model="newAveragePrice"
        type="number"
        placeholder="Enter avg price"
      />

      <label for="quantity">Quantity:</label>
      <input id="quantity" v-model="newQuantity" type="number" placeholder="Enter quantity" />

      <div class="button-group">
        <button @click="createHolding">Create</button>
        <button @click="showForm = false" class="cancel-button">Cancel</button>
      </div>
    </div>
    <!-- Pagination and Form (unchanged) -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import {
  fetchStockHoldingsByAccount,
  createStockHolding,
  updateStockHolding,
  deleteStockHolding,
} from '../api/stock'

const stockHoldings = ref([])
const newTickerSymbol = ref('')
const newQuantity = ref('')
const newAveragePrice = ref('')
const newCountry = ref('')
const showForm = ref(false)

const editedQuantity = ref('')
const editedAveragePrice = ref('')
const editingQuantityId = ref(null)
const editingPriceId = ref(null)

const currentPage = ref(1)
const itemsPerPage = ref(10)
const jumpToPage = ref(1)

const totalPages = computed(() => Math.ceil(stockHoldings.value.length / itemsPerPage.value))

const paginatedStockHoldings = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return stockHoldings.value.slice(start, end)
})

const fetchHoldings = async () => {
  try {
    const response = await fetchStockHoldingsByAccount()
    if (response && response.data) {
      stockHoldings.value = response.data
    }
  } catch (error) {
    console.error('Error fetching stock holdings:', error)
  }
}

const createHolding = async () => {
  const missingFields = []

  if (!newTickerSymbol.value) missingFields.push('Ticket Symbol')
  if (!newQuantity.value) missingFields.push('Quantity')
  if (!newAveragePrice.value) missingFields.push('Average Price')
  if (!newCountry.value) missingFields.push('Country')

  if (missingFields.length > 0) {
    alert('Please fill in the following fields:\n' + missingFields.join(', '))
    return
  }

  try {
    const response = await createStockHolding(
      newTickerSymbol.value,
      parseFloat(newQuantity.value),
      parseFloat(newAveragePrice.value),
      newCountry.value,
    )
    if (response && response.data) {
      await fetchHoldings()
      newTickerSymbol.value = ''
      newQuantity.value = ''
      newAveragePrice.value = ''
      newCountry.value = ''
      showForm.value = false
    }
  } catch (error) {
    console.error('Error creating stock holding:', error)
  }
}

const handleDeleteHolding = async (holdingId) => {
  try {
    await deleteStockHolding(holdingId)
    await fetchHoldings()
  } catch (error) {
    console.error('Error deleting stock holding:', error)
  }
}

const startEditingPrice = async (id, avgPrice) => {
  editingPriceId.value = id
  editingQuantityId.value = null
  editedAveragePrice.value = avgPrice.toString()
  await nextTick()
}

const startEditingQuantity = async (id, qty) => {
  editingQuantityId.value = id
  editingPriceId.value = null
  editedQuantity.value = qty.toString()
  await nextTick()
}

const handleUpdateHolding = async (id) => {
  const update = {}
  if (editingQuantityId.value === id) {
    update.quantity = parseFloat(editedQuantity.value)
  }
  if (editingPriceId.value === id) {
    update.average_price = parseFloat(editedAveragePrice.value)
  }

  try {
    const response = await updateStockHolding(id, update)
    if (response) {
      await fetchHoldings()
    }
  } catch (error) {
    console.error('Error updating stock holding:', error)
  } finally {
    cancelEditing()
  }
}

const cancelEditing = () => {
  editingQuantityId.value = null
  editingPriceId.value = null
}

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

onMounted(fetchHoldings)
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

select,
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
