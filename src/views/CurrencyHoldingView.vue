<template>
  <div class="container">
    <!-- Table for displaying currency holdings -->
    <div class="table-container">
      <table v-if="!showForm">
        <thead>
          <tr>
            <th>Country</th>
            <th>Currency Code</th>
            <th>Amount Held</th>
            <th>Average Cost/Unit</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in currencyHoldings" :key="item.id">
            <td>{{ item.country }}</td>
            <td>{{ item.currency_code }}</td>
            <td>
              <input
                v-if="editingAmountHeldId === item.id"
                v-model="editedAmountHeld"
                type="number"
                @keyup.enter="handleUpdateHolding(item.id)"
                @blur="cancelEditing"
              />
              <span
                v-else
                class="editable-button"
                @click="startEditingAmountHeld(item.id, item.amount_held)"
              >
                {{ Number(item.amount_held).toFixed(2) }}
              </span>
            </td>
            <td>
              <input
                v-if="editingAverageCostId === item.id"
                v-model="editedAverageCost"
                type="number"
                @keyup.enter="handleUpdateHolding(item.id)"
                @blur="cancelEditing"
              />
              <span
                v-else
                class="editable-button"
                @click="startEditingAverageCost(item.id, item.average_cost_per_unit)"
              >
                {{ Number(item.average_cost_per_unit).toFixed(4) }}
              </span>
            </td>
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

    <!-- Form for adding new currency holding -->
    <div v-if="showForm" class="asset-form">
      <label for="country">Country:</label>
      <select id="country" v-model="newCountry">
        <option disabled value="" hidden>Select Country</option>
        <option value="TW">Taiwan</option>
        <option value="US">United States</option>
        <option value="JP">Japan</option>
        <!-- Add more if needed -->
      </select>

      <label for="average_cost">Average Cost/Unit:</label>
      <input
        id="average_cost"
        v-model="newAverageCost"
        type="number"
        placeholder="Enter average cost per unit"
      />

      <label for="amount">Amount Held:</label>
      <input id="amount" v-model="newAmountHeld" type="number" placeholder="Enter amount" />

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
  fetchCurrencyHoldingsByAccount,
  createCurrencyHolding,
  updateCurrencyHolding,
  deleteCurrencyHolding,
} from '../api/currency_holding.ts'
import IconButton from '@/components/IconButton.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

// Currency → Currency Code map
const currencyCodeMap = {
  TW: 'TWD',
  US: 'USD',
  JP: 'JPY',
}

// Automatically resolve currency code from selected country
const resolvedCurrencyCode = computed(() => currencyCodeMap[newCountry.value] ?? '')

// State
const currencyHoldings = ref([])
const newAmountHeld = ref('')
const newAverageCost = ref('')
const newCountry = ref('')
const showForm = ref(false)
const showConfirm = ref(false)
const deletingId = ref(null)

// Edit mode
const editedAmountHeld = ref('')
const editedAverageCost = ref('')
const editingAmountHeldId = ref(null)
const editingAverageCostId = ref(null)

const fetchHoldings = async () => {
  try {
    const data = await fetchCurrencyHoldingsByAccount()
    if (data) {
      currencyHoldings.value = data
    }
  } catch (error) {
    console.error('Error fetching currency holdings:', error)
  }
}

const createHolding = async () => {
  const missingFields = []
  if (!newCountry.value) missingFields.push('Country')
  if (!newAmountHeld.value) missingFields.push('Amount Held')
  if (!newAverageCost.value) missingFields.push('Average Cost')

  if (missingFields.length > 0) {
    alert('Please fill in the following fields:\n' + missingFields.join(', '))
    return
  }

  try {
    await createCurrencyHolding(
      newCountry.value,
      resolvedCurrencyCode.value,
      parseFloat(newAmountHeld.value),
      parseFloat(newAverageCost.value),
    )
    await fetchHoldings()
    newAmountHeld.value = ''
    newAverageCost.value = ''
    newCountry.value = ''
    showForm.value = false
  } catch (error) {
    console.error('Error creating currency holding:', error)
  }
}

const handleDeleteHolding = async (id) => {
  try {
    await deleteCurrencyHolding(id)
    await fetchHoldings()
  } catch (error) {
    console.error('Error deleting currency holding:', error)
  }
}

const startEditingAmountHeld = async (id, amount) => {
  editingAmountHeldId.value = id
  editingAverageCostId.value = null
  editedAmountHeld.value = amount.toString()
  await nextTick()
}

const startEditingAverageCost = async (id, cost) => {
  editingAverageCostId.value = id
  editingAmountHeldId.value = null
  editedAverageCost.value = cost.toString()
  await nextTick()
}

const handleUpdateHolding = async (id) => {
  const update = {}
  if (editingAmountHeldId.value === id) {
    update.amount_held = parseFloat(editedAmountHeld.value)
  }
  if (editingAverageCostId.value === id) {
    update.average_cost_per_unit = parseFloat(editedAverageCost.value)
  }

  try {
    await updateCurrencyHolding(id, update)
    await fetchHoldings()
  } catch (error) {
    console.error('Error updating currency holding:', error)
  } finally {
    cancelEditing()
  }
}

const cancelEditing = () => {
  editingAmountHeldId.value = null
  editingAverageCostId.value = null
}

function openForm() {
  newAmountHeld.value = ''
  newAverageCost.value = ''
  newCountry.value = ''
  showForm.value = true
}

function closeForm() {
  showForm.value = false
}

const onConfirmDelete = async () => {
  showConfirm.value = false
  await handleDeleteHolding(deletingId.value)
  deletingId.value = null
}

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
