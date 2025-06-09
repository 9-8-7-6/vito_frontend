<template>
  <!-- Outer container for the entire transaction interface -->
  <div class="container">
    <!-- Container for the transaction table and filters -->
    <div class="table-container">
      <!-- Buttons to filter transactions by type -->
      <div class="filter-transaction-type">
        <button @click="filterType = 'All'">All</button>
        <button @click="filterType = 'Income'">Income</button>
        <button @click="filterType = 'Expense'">Expense</button>
        <button @click="filterType = 'InternalTransfer'">Internal Transfer</button>
      </div>

      <!-- Table to display paginated transactions -->
      <table>
        <thead>
          <tr>
            <th>Number</th>
            <th>Asset</th>
            <th>Amount</th>
            <th>Fee</th>
            <th>Transaction Time</th>
            <th>Notes</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          <!-- Iterate through paginated transactions -->
          <tr v-for="(transaction, index) in paginatedTransactions" :key="transaction.id">
            <!-- Show running number considering current page -->
            <td>{{ index + 1 + (currentPage - 1) * itemsPerPage }}</td>

            <!-- Display asset direction (e.g. A -> B) -->
            <td>
              <span v-if="transaction.from_asset_type && transaction.to_asset_type">
                {{ transaction.from_asset_type }} -> {{ transaction.to_asset_type }}
              </span>
              <span v-else-if="transaction.from_asset_type">
                {{ transaction.from_asset_type }}
              </span>
              <span v-else-if="transaction.to_asset_type">
                {{ transaction.to_asset_type }}
              </span>
            </td>

            <!-- Editable amount field -->
            <td>
              <span
                v-if="editingId !== transaction.id"
                :class="['amount-display', transaction.transaction_type]"
                @click="startEditing(transaction.id, transaction.amount, 'amount')"
              >
                <!-- Show +amount or -amount based on transaction type -->
                {{
                  transaction.transaction_type === 'Income'
                    ? '+' + transaction.amount
                    : transaction.transaction_type === 'Expense'
                      ? '-' + transaction.amount
                      : transaction.amount
                }}
              </span>
              <!-- Input field shown when editing amount -->
              <input
                v-else-if="editingField === 'amount'"
                v-model="editedValue"
                type="number"
                @keyup.enter="
                  updateTransactionField(transaction.id, 'amount', parseFloat(editedValue))
                "
                @blur="cancelEditing"
              />
            </td>

            <!-- Editable fee field -->
            <td>
              <span
                v-if="editingId !== transaction.id"
                @click="startEditing(transaction.id, transaction.fee, 'fee')"
              >
                {{ transaction.fee }}
              </span>
              <!-- Input field shown when editing fee -->
              <input
                v-else-if="editingField === 'fee'"
                v-model="editedValue"
                type="number"
                @keyup.enter="
                  updateTransactionField(transaction.id, 'fee', parseFloat(editedValue))
                "
                @blur="cancelEditing"
              />
            </td>

            <!-- Display time and notes -->
            <td>{{ transaction.transaction_time }}</td>
            <td>{{ transaction.notes }}</td>

            <!-- Delete transaction button -->
            <td>
              <button class="action-button" @click="handleDeleteTransaction(transaction.id)">
                Delete
              </button>
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

      <!-- Jump to specific page -->
      <input v-model.number="jumpToPage" type="number" min="1" :max="totalPages" />
      <button @click="goToPage">Jump to</button>

      <!-- Items per page dropdown -->
      <label>
        Per page：
        <select v-model="itemsPerPage" @change="currentPage = 1">
          <option :value="10">10</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
        </select>
      </label>
    </div>

    <!-- Button to open create form -->
    <button v-if="!showForm" @click="showForm = true" class="create-transaction-button">
      Create New Transaction
    </button>

    <!-- Choose transaction type -->
    <div v-if="showForm" class="transaction-form">
      <button @click="toggleTransaction('income')">Income</button>
      <button @click="toggleTransaction('expense')">Expense</button>
      <button @click="toggleTransaction('internalTransfer')">Internal Transfer</button>
      <!-- Placeholder for future transfer feature -->
      <!-- <button @click="toggleTransaction('Transfer')">Transfer</button> -->
      <button @click="toggleTransaction('')">Cancel</button>
    </div>

    <!-- ====================== Transaction Forms ======================= -->
    <div class="create-transaction-form">
      <!-- Income transaction form -->
      <div v-if="showIncome" class="create-transaction-form-wrapper">
        <h2>New Income Transaction</h2>
        <div class="form-group">
          <label for="amount">Amount</label>
          <input v-model="newAmount" id="amount" type="number" placeholder="Enter amount" />
        </div>

        <div class="form-group">
          <label for="asset_id">To Asset</label>
          <select v-model="newToAssetId" id="asset_id">
            <option disabled value="">-- Select Asset --</option>
            <option v-for="asset in assets" :key="asset.id" :value="asset.id">
              {{ asset.asset_type }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="transaction_time">Transaction Time(Default Now)</label>
          <input v-model="newTransactionTime" id="transaction_time" type="datetime-local" />
        </div>

        <div class="form-group">
          <label for="notes">Notes</label>
          <input v-model="newNotes" id="notes" type="text" placeholder="Enter notes (optional)" />
        </div>

        <button @click="createTransactionIncome">Submit</button>
        <button class="cancel-button" @click="toggleTransaction('')">Cancel</button>
      </div>

      <!-- Expense transaction form -->
      <div v-if="showExpense" class="create-transaction-form-wrapper">
        <h2>New Expense Transaction</h2>

        <div class="form-group">
          <label for="amount">Amount</label>
          <input v-model="newAmount" id="amount" type="number" placeholder="Enter amount" />
        </div>

        <div class="form-group">
          <label for="asset_id">From Asset</label>
          <select v-model="newFromAssetId" id="asset_id">
            <option disabled value="">-- Select Asset --</option>
            <option v-for="asset in assets" :key="asset.id" :value="asset.id">
              {{ asset.asset_type }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="transaction_time">Transaction Time(Default Now)</label>
          <input v-model="newTransactionTime" id="transaction_time" type="datetime-local" />
        </div>

        <div class="form-group">
          <label for="notes">Notes</label>
          <input v-model="newNotes" id="notes" type="text" placeholder="Enter notes (optional)" />
        </div>

        <button @click="createTransactionExpense">Submit</button>
        <button class="cancel-button" @click="toggleTransaction('')">Cancel</button>
      </div>

      <!-- Internal transfer transaction form -->
      <div v-if="showInternalTransfer" class="create-transaction-form-wrapper">
        <h2>New Internal Transfer Transaction</h2>

        <div class="form-group">
          <label for="fromAssetId">From Asset</label>
          <select v-model="newFromAssetId" id="fromAssetId">
            <option disabled value="">-- Select Asset --</option>
            <option v-for="asset in assets" :key="asset.id" :value="asset.id">
              {{ asset.asset_type }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="toAssetId">To Asset</label>
          <select v-model="newToAssetId" id="toAssetId">
            <option disabled value="">-- Select Asset --</option>
            <option v-for="asset in assets" :key="asset.id" :value="asset.id">
              {{ asset.asset_type }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="amount">Amount</label>
          <input v-model="newAmount" id="amount" type="number" placeholder="Enter amount" />
        </div>

        <div class="form-group">
          <label for="fee">Fee</label>
          <input v-model="newFee" id="fee" type="number" placeholder="Enter fee" />
        </div>

        <div class="form-group">
          <label for="transaction_time">Transaction Time(Default Now)</label>
          <input v-model="newTransactionTime" id="transaction_time" type="datetime-local" />
        </div>

        <div class="form-group">
          <label for="notes">Notes</label>
          <input v-model="newNotes" id="notes" type="text" placeholder="Enter notes (optional)" />
        </div>

        <button @click="createTransactionInternalTransfer">Submit</button>
        <button class="cancel-button" @click="toggleTransaction('')">Cancel</button>
      </div>

      <!-- Placeholder for general Transfer (future feature) -->
      <div v-if="showTransfer" class="create-transaction-form-wrapper">
        <h1>Transfer</h1>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import {
  addTransactionIncome,
  addTransactionExpense,
  addTransactionInternalTransfer,
  getTransactionsByUserId,
  deleteTransaction,
  updateTransaction,
} from '../api/transaction'
import { getAsset } from '../api/asset'
import { getCookie, setCookie } from 'typescript-cookie'

// === UI State ===
const showForm = ref(false)
const showIncome = ref(false)
const showExpense = ref(false)
const showTransfer = ref(false)
const showInternalTransfer = ref(false)

// === Form Fields for Creating Transaction ===
const newAmount = ref('')
const newTransactionTime = ref('')
const newNotes = ref('')

const newFromAssetId = ref('')
const newToAssetId = ref('')
const newFee = ref('')

// === Data Lists ===
const transactions = ref([])
const assets = ref([])

// === Inline Editing State ===
const editingId = ref(null)
const editedValue = ref('')
const editingField = ref('')

const editingTypeId = ref(null)
const editedTypeValue = ref('')

// === Pagination ===
const currentPage = ref(1)
const itemsPerPage = ref(parseInt(getCookie('itemsPerPage') || '10', 10))

// Save pagination preference to cookie
watch(itemsPerPage, (newVal) => {
  setCookie('itemsPerPage', newVal.toString(), {
    path: '/',
    sameSite: 'none',
    secure: true,
  })
})

const jumpToPage = ref(1)
const totalPages = computed(() => Math.ceil(transactions.value.length / itemsPerPage.value))

// === Filtering by Transaction Type ===
const filterType = ref('All')
watch(filterType, () => {
  currentPage.value = 1
  jumpToPage.value = 1
})

// === UI Transaction Type Toggle ===
const toggleTransaction = (type) => {
  showIncome.value = false
  showExpense.value = false
  showTransfer.value = false
  showInternalTransfer.value = false

  if (type === '') showForm.value = false
  if (type === 'income') showIncome.value = true
  if (type === 'expense') showExpense.value = true
  if (type === 'Transfer') showTransfer.value = true
  if (type === 'internalTransfer') showInternalTransfer.value = true
}

// === Fetch API Data ===
const fetchTransactions = async () => {
  try {
    const response = await getTransactionsByUserId()
    if (response && response.data) {
      transactions.value = response.data
    } else {
      console.error('Invalid API response', response)
    }
  } catch (error) {
    console.error('Error fetching transactions:', error)
  }
}

const fetchAssetType = async () => {
  try {
    const response = await getAsset()
    if (response && response.data) {
      assets.value = response.data
    } else {
      console.error('Invalid API response', response)
    }
  } catch (error) {
    console.error('Error fetching transactions:', error)
  }
}

watch(filterType, () => {
  currentPage.value = 1
  jumpToPage.value = 1
})

// === Create Transaction APIs ===
const createTransactionIncome = async () => {
  const missingFields = []
  if (!newAmount.value) missingFields.push('Amount')
  if (!newToAssetId.value) missingFields.push('To Asset')

  if (missingFields.length > 0) {
    alert('Please fill in the following fields:\n' + missingFields.join(', '))
    return
  }

  let isoString = newTransactionTime.value ? new Date(newTransactionTime.value).toISOString() : null

  try {
    const response = await addTransactionIncome(
      'Income',
      parseFloat(newAmount.value),
      newToAssetId.value,
      isoString,
      newNotes.value,
    )

    if (response && response.data) {
      alert('Transaction added successfully!')
      // Clear form
      newAmount.value = ''
      newToAssetId.value = ''
      newTransactionTime.value = ''
      newNotes.value = ''
      showIncome.value = false
      window.location.reload() // Reload to reflect new transaction
    } else {
      alert('Failed to add transaction.')
    }
  } catch (error) {
    console.error('Error adding transaction:', error)
    alert('An error occurred while adding the transaction.')
  }
}

const createTransactionExpense = async () => {
  const missingFields = []
  if (!newAmount.value) missingFields.push('Amount')
  if (!newFromAssetId.value) missingFields.push('From Asset')

  if (missingFields.length > 0) {
    alert('Please fill in the following fields:\n' + missingFields.join(', '))
    return
  }

  let isoString = newTransactionTime.value ? new Date(newTransactionTime.value).toISOString() : null

  try {
    const response = await addTransactionExpense(
      'Expense',
      parseFloat(newAmount.value),
      newFromAssetId.value,
      isoString,
      newNotes.value,
    )

    if (response && response.data) {
      alert('Transaction added successfully!')
      newAmount.value = ''
      newFromAssetId.value = ''
      newTransactionTime.value = ''
      newNotes.value = ''
      showIncome.value = false
      window.location.reload()
    } else {
      alert('Failed to add transaction.')
    }
  } catch (error) {
    console.error('Error adding transaction:', error)
    alert('An error occurred while adding the transaction.')
  }
}

const createTransactionInternalTransfer = async () => {
  const missingFields = []
  if (!newAmount.value) missingFields.push('Amount')
  if (!newFromAssetId.value) missingFields.push('From Asset')
  if (!newToAssetId.value) missingFields.push('To Asset')

  if (missingFields.length > 0) {
    alert('Please fill in the following fields:\n' + missingFields.join(', '))
    return
  }

  let isoString = newTransactionTime.value ? new Date(newTransactionTime.value).toISOString() : null

  try {
    const response = await addTransactionInternalTransfer(
      'InternalTransfer',
      parseFloat(newAmount.value),
      parseFloat(newFee.value),
      newFromAssetId.value,
      newToAssetId.value,
      isoString,
      newNotes.value,
    )

    if (response && response.data) {
      alert('Transaction added successfully!')
      newFromAssetId.value = ''
      newToAssetId.value = ''
      newFee.value = ''
      newAmount.value = ''
      newTransactionTime.value = ''
      newNotes.value = ''
      showIncome.value = false
      window.location.reload()
    } else {
      alert('Failed to add transaction.')
    }
  } catch (error) {
    console.error('Error adding transaction:', error)
    alert('An error occurred while adding the transaction.')
  }
}

// === Delete Transaction ===
const handleDeleteTransaction = async (transaction_id) => {
  try {
    const response = await deleteTransaction(transaction_id)
    window.location.reload()
  } catch (error) {
    console.error('Error deleting transaction:', error)
  }
}

// === Edit Fields ===
const startEditing = async (transactionId, value, field) => {
  editingId.value = transactionId
  editingField.value = field
  editedValue.value = value
  await nextTick()
}

const startEditingType = async (transactionId, transactionType) => {
  editingTypeId.value = transactionId
  editedTypeValue.value = transactionType
  await nextTick()
}

const updateTransactionField = async (transaction_id, field, value) => {
  try {
    const updatedFields = { [field]: value }
    await updateTransaction(transaction_id, updatedFields)
    await fetchTransactions()
    cancelEditing()
    cancelEditingType()
  } catch (error) {
    console.error(`Failed to update ${field}:`, error)
  }
}

const handleUpdateTransaction = async (transaction_id, field, value) => {
  try {
    const updatedFields = {}
    await updateTransaction(transaction_id, updatedFields)
    window.location.reload()
  } catch (error) {
    console.error('Error updating transaction:', error)
  }
}

const cancelEditing = () => {
  editingId.value = null
  editingField.value = ''
  editedValue.value = ''
}

const cancelEditingType = () => {
  editingTypeId.value = null
  editedTypeValue.value = ''
}

// === Computed Data ===
// Filter by transaction type
const filteredTransactions = computed(() => {
  if (filterType.value === 'All') return transactions.value
  return transactions.value.filter((t) => t.transaction_type === filterType.value)
})

// Paginate the filtered data
const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredTransactions.value.slice(start, end)
})

// === Pagination Methods ===
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

// === Initial Data Load on Mount ===
onMounted(async () => {
  await fetchTransactions()
  await fetchAssetType()
})
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
input,
select {
  width: 250px;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #444;
  border-radius: 5px;
  background-color: #333;
  color: white;
}

option {
  background-color: #2e2e2e;
  color: #ccc;
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

.create-transaction-button {
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

.transaction-type-button,
.transaction-type-input {
  min-width: 100px;
  width: auto;
  padding: 8px 12px;
  text-align: center;
}

.transaction-type-input {
  border: 1px solid #444;
  border-radius: 5px;
  background-color: #333;
  color: white;
}

.transaction-form {
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 0 auto 20px auto;
  gap: 10px;
  padding: 20px;
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

.create-transaction-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 0 auto 20px auto;
  gap: 10px;
  padding: 20px;
  border-radius: 10px;
}

.create-transaction-form-wrapper {
  width: 400px;
  background-color: #2e2e2e;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.create-transaction-form-wrapper h2 {
  margin-bottom: 15px;
  color: #fff;
  text-align: center;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.form-group label {
  font-size: 16px;
  margin-bottom: 5px;
  color: #fff;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #444;
  border-radius: 5px;
  background-color: #333;
  color: #ccc;
  outline: none;
  transition: border-color 0.3s;
}

.form-group input:focus {
  border-color: #007bff;
}

.create-transaction-form-wrapper button {
  margin-right: 10px;
  margin-top: 10px;
}

.cancel-button {
  background-color: #d9534f;
}

.cancel-button:hover {
  background-color: #c9302c;
}

.filter-transaction-type {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.filter-transaction-type button {
  padding: 8px 16px;
  border-radius: 5px;
  border: 1px solid #444;
  background-color: #333;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s;
}

.filter-transaction-type button:hover {
  background-color: #444;
}

.amount-display {
  font-weight: bold;
  cursor: pointer;
}

.amount-display.Income {
  color: #00bfff;
}

.amount-display.Expense {
  color: #ff4d4f;
}

.amount-display.InternalTransfer {
  color: white;
}
</style>
