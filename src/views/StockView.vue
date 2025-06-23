<template>
  <div class="container">
    <!-- Table for displaying stock holdings -->
    <div class="table-container">
      <table v-if="!showForm">
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
          <!-- Iterate through data -->
          <tr v-for="item in stockHoldings" :key="item.id">
            <!-- Display stock symbol and company name -->
            <td>{{ `${item.ticker_symbol} (${item.company_name})` }}</td>

            <!-- Editable average price field -->
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
                    item.quantity * item.current_price * 0.995575 -
                      item.quantity * item.average_price * 1.001425 >=
                      0,
                  loss:
                    item.current_price &&
                    item.quantity * item.current_price * 0.995575 -
                      item.quantity * item.average_price * 1.001425 <
                      0,
                }"
                @click="startEditingPrice(item.id, item.average_price)"
              >
                {{
                  item.current_price
                    ? item.quantity * item.current_price - item.quantity * item.average_price >= 0
                      ? Number(item.average_price).toFixed(2)
                      : Number(item.average_price).toFixed(2)
                    : Number(item.average_price).toFixed(2)
                }}
              </span>
            </td>

            <!-- Current price (could be null) -->
            <td>{{ item.current_price ?? 'N/A' }}</td>

            <!-- Editable quantity field -->
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

            <!-- Cost = quantity * average price -->
            <td>{{ (item.quantity * item.average_price * 1.001425).toFixed(2) }}</td>

            <!-- Value = quantity * current price -->
            <td>
              {{
                item.current_price
                  ? (item.quantity * item.current_price * 0.995575).toFixed(2)
                  : 'N/A'
              }}
            </td>

            <!-- Profit or Loss with percentage -->
            <td>
              <span
                :class="{
                  profit:
                    item.current_price &&
                    item.quantity * item.current_price * 0.995575 -
                      item.quantity * item.average_price * 1.001425 >=
                      0,
                  loss:
                    item.current_price &&
                    item.quantity * item.current_price * 0.995575 -
                      item.quantity * item.average_price * 1.001425 <
                      0,
                }"
              >
                {{
                  item.current_price
                    ? (() => {
                        const cost = item.quantity * item.average_price * 1.001425
                        const value = item.quantity * item.current_price * 0.995575
                        const profit = value - cost
                        const percent = cost !== 0 ? ((profit / cost) * 100).toFixed(2) : '0.00'
                        return (profit >= 0 ? '+' : '') + profit.toFixed(2) + ` (${percent}%)`
                      })()
                    : 'N/A'
                }}
              </span>
            </td>

            <!-- Delete button -->
            <td>
              <IconButton
                :icon="['fas', 'trash']"
                @click="
                  () => {
                    deletingId = item.id
                    showConfirm = true
                  }
                "
              />
              <ConfirmDialog
                v-if="showConfirm"
                @confirm="onConfirmDelete"
                @cancel="showConfirm = false"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Toggle create form -->
    <button v-if="!showForm" @click="openForm" class="create-asset-button">
      <font-awesome-icon :icon="['fas', 'plus']" />
    </button>

    <!-- Form for adding new holding -->
    <div v-if="showForm" class="asset-form">
      <label for="country">Country:</label>
      <select id="country" v-model="newCountry">
        <option disabled value="" hidden>Select Country</option>
        <option value="TW">Taiwan</option>
        <option value="US">United States</option>
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

      <!-- Submit/cancel buttons -->
      <div class="button-group">
        <button @click="createHolding">Create</button>
        <button @click="closeForm" class="cancel-button">Cancel</button>
      </div>
    </div>
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
import IconButton from '@/components/IconButton.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

// Reactive references for holding data and form inputs
const stockHoldings = ref([])
const newTickerSymbol = ref('')
const newQuantity = ref('')
const newAveragePrice = ref('')
const newCountry = ref('')
const showForm = ref(false)
const showConfirm = ref(false)
const deletingId = ref(null)

const onConfirmDelete = async () => {
  showConfirm.value = false
  await handleDeleteHolding(deletingId.value)
  deletingId.value = null
}

function openForm() {
  // 每次打開前先把欄位重置（若需要）
  newTickerSymbol.value = ''
  newQuantity.value = ''
  newAveragePrice.value = ''
  newCountry.value = ''
  showForm.value = true
}

function closeForm() {
  showForm.value = false
}

// Edit mode state
const editedQuantity = ref('')
const editedAveragePrice = ref('')
const editingQuantityId = ref(null)
const editingPriceId = ref(null)

// Calculate total number of pages
const totalPages = computed(() => Math.ceil(stockHoldings.value.length / itemsPerPage.value))

// Fetch stock holdings from API
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

// Handle form submission to create a new stock holding
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
      // Reset form
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

// Delete a holding
const handleDeleteHolding = async (holdingId) => {
  try {
    await deleteStockHolding(holdingId)
    await fetchHoldings()
  } catch (error) {
    console.error('Error deleting stock holding:', error)
  }
}

// Start editing average price for a holding
const startEditingPrice = async (id, avgPrice) => {
  editingPriceId.value = id
  editingQuantityId.value = null // prevent editing both fields at the same time
  editedAveragePrice.value = avgPrice.toString()
  await nextTick()
}

// Start editing quantity for a holding
const startEditingQuantity = async (id, qty) => {
  editingQuantityId.value = id
  editingPriceId.value = null
  editedQuantity.value = qty.toString()
  await nextTick()
}

// Submit update for a holding (either price, quantity, or both)
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

// Exit editing mode
const cancelEditing = () => {
  editingQuantityId.value = null
  editingPriceId.value = null
}

// Fetch data when component mounts
onMounted(fetchHoldings)
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px auto;
  background-color: #1e1e1e;
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
  background-color: #007bff;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.create-asset-button {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 100;
  background-color: #d9534f;
  width: clamp(48px, 6vw, 80px);
  height: clamp(48px, 6vw, 80px);
  padding: 0;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.create-asset-button:hover {
  background-color: #c9302c;
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
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 10px;
  width: auto;
}

.button-group button {
  padding: 10px 20px;
  box-sizing: border-box;
  border-radius: 5px;
  font-size: 16px;
}

.cancel-button {
  background-color: #d9534f;
  color: white;
  border: none;
}

.button-group button:not(.cancel-button) {
  background-color: #007bff;
  color: white;
  border: none;
}
.button-group button:not(.cancel-button):hover {
  background-color: #0056b3;
}
.cancel-button:hover {
  background-color: #c9302c;
}

.profit {
  color: #ff4d4f;
  font-weight: bold;
}

.loss {
  color: #0d8d24;
  font-weight: bold;
}

/* ============== MOBILE (<=768px) ============== */
@media (max-width: 768px) {
  .container {
    justify-content: flex-start;
    padding-top: 1rem;
  }

  /* filter buttons stack */
  .filter-transaction-type {
    flex-wrap: wrap;
    gap: 5px;
  }
  .filter-transaction-type button {
    flex: 1 1 48%;
    font-size: 0.9rem;
  }

  /* table becomes horizontally scrollable */
  .table-container {
    overflow-x: auto;
  }
  .table-container table {
    width: auto;
    min-width: max-content;
  }
  th,
  td {
    padding: 6px;
    font-size: 0.8rem;
  }

  /* create button full width */
  .create-transaction-button {
    width: 100%;
  }

  /* transaction type toggle buttons full width */
  .transaction-form button {
    flex: 1 1 48%;
    width: auto;
  }

  /* form wrappers adapt */
  .create-transaction-form-wrapper {
    width: 100%;
    padding: 15px;
  }
  .form-group input,
  .form-group select,
  .form-group button {
    width: 100%;
  }
}
</style>
