<template>
  <div class="container">
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Number</th>
            <th>Transaction type</th>
            <th>Amount</th>
            <th>Last time updated</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(transaction, index) in paginatedTransactions" :key="transaction.id">
            <td>{{ index + 1 + (currentPage - 1) * itemsPerPage }}</td>
            <td>
              <button
                v-if="editingTypeId !== transaction.id"
                class="transaction-type-button"
                @click="startEditingType(transaction.id, transaction.transaction_type)"
              >
                {{ transaction.transaction_type }}
              </button>
              <input
                v-else
                class="transaction-type-input"
                v-model="editedTypeValue"
                type="text"
                @keyup.enter="handleUpdateTransactionType(transaction.id, transaction.amount)"
                @blur="cancelEditingType"
              />
            </td>
            <td>
              <button
                v-if="editingId !== transaction.id"
                @click="startEditing(transaction.id, transaction.amount)"
              >
                {{ transaction.amount }}
              </button>
              <input
                v-else
                v-model="editedValue"
                type="number"
                @keyup.enter="handleUpdateTransaction(transaction.id, transaction.transaction_type)"
                @blur="cancelEditing"
              />
            </td>
            <td>{{ transaction.updated_at }}</td>
            <td>
              <button class="action-button" @click="handleDeleteTransaction(transaction.id)">
                Detail
              </button>
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

    <button v-if="!showForm" @click="showForm = true" class="create-transaction-button">
      Create New Transaction
    </button>

    <div v-if="showForm" class="transaction-form">
      <button @click="toggleTransaction('income')">Income</button>
      <button @click="toggleTransaction('expense')">Expense</button>
      <button @click="toggleTransaction('internalTransfer')">Internal Transfer</button>
      <!-- Todo -->
      <!-- <button @click="toggleTransaction('Transfer')">Transfer</button> -->
      <button @click="toggleTransaction('')">Cancel</button>
    </div>

    <div class="create-transaction-form">
      <div v-if="showIncome" class="create-transaction-form-wrapper">
        <h2>New Income Transaction</h2>
        <div class="form-group">
          <label for="amount">Amount</label>
          <input v-model="newAmount" id="amount" type="number" placeholder="Enter amount" />
        </div>

        <div class="form-group">
          <label for="asset_id">Asset ID</label>
          <input v-model="newToAssetId" id="asset_id" type="text" placeholder="Enter asset ID" />
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
      <div v-if="showExpense" class="create-transaction-form-wrapper">
        <h2>New Expense Transaction</h2>

        <div class="form-group">
          <label for="amount">Amount</label>
          <input v-model="newAmount" id="amount" type="number" placeholder="Enter amount" />
        </div>

        <div class="form-group">
          <label for="asset_id">Asset ID</label>
          <input v-model="newFromAssetId" id="asset_id" type="text" placeholder="Enter asset ID" />
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

      <div v-if="showInternalTransfer" class="create-transaction-form-wrapper">
        <h2>New Internal Transfer</h2>

        <div class="form-group">
          <label for="fromAssetId">From Asset ID</label>
          <input
            v-model="newFromAssetId"
            id="fromAssetId"
            type="text"
            placeholder="Enter from asset ID"
          />
        </div>

        <div class="form-group">
          <label for="toAssetId">To Asset ID</label>
          <input
            v-model="newToAssetId"
            id="toAssetId"
            type="text"
            placeholder="Enter to asset ID"
          />
        </div>

        <div class="form-group">
          <label for="fee">Fee</label>
          <input v-model="newFee" id="fee" type="number" placeholder="Enter fee" />
        </div>

        <div class="form-group">
          <label for="amount">Amount</label>
          <input v-model="newAmount" id="amount" type="number" placeholder="Enter amount" />
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
      <div v-if="showTransfer" class="create-transaction-form-wrapper">
        <h1>Transfer</h1>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import {
  addTransactionIncome,
  addTransactionExpense,
  addTransactionInternalTransfer,
} from '../api/transaction'

const showForm = ref(false)
const showIncome = ref(false)
const showExpense = ref(false)
const showTransfer = ref(false)
const showInternalTransfer = ref(false)

const newAmount = ref('')
const newTransactionTime = ref('')
const newNotes = ref('')

const newFromAssetId = ref('')
const newToAssetId = ref('')
const newFee = ref('')

const transactions = ref([])

const editingId = ref(null)
const editedValue = ref('')

const editingTypeId = ref(null)
const editedTypeValue = ref('')

const currentPage = ref(1)
const itemsPerPage = ref(10)
const jumpToPage = ref(1)
const totalPages = computed(() => Math.ceil(transactions.value.length / itemsPerPage.value))

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

const fetchTransactions = async () => {}

const createTransactionIncome = async () => {
  if (!newAmount.value || !newToAssetId.value) {
    alert('Please fill in all required fields')
    return
  }

  let isoString = null
  if (newTransactionTime.value) {
    isoString = new Date(newTransactionTime.value).toISOString()
  }

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

      newAmount.value = ''
      newToAssetId.value = ''
      newTransactionTime.value = ''
      newNotes.value = ''
      showIncome.value = false
    } else {
      console.error('Invalid API response', response)
      alert('Failed to add transaction. Please try again.')
    }
  } catch (error) {
    console.error('Error adding transaction:', error)
    alert('An error occurred while adding the transaction.')
  }
}

const createTransactionExpense = async () => {
  if (!newAmount.value || !newFromAssetId.value) {
    alert('Please fill in all required fields')
    return
  }

  let isoString = null
  if (newTransactionTime.value) {
    isoString = new Date(newTransactionTime.value).toISOString()
  }

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
    } else {
      console.error('Invalid API response', response)
      alert('Failed to add transaction. Please try again.')
    }
  } catch (error) {
    console.error('Error adding transaction:', error)
    alert('An error occurred while adding the transaction.')
  }
}

const createTransactionInternalTransfer = async () => {
  if (!newAmount.value || !newFromAssetId.value || !newToAssetId.value || !newFee.value) {
    alert('Please fill in all required fields')
    return
  }

  let isoString = null
  if (newTransactionTime.value) {
    isoString = new Date(newTransactionTime.value).toISOString()
  }

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
    } else {
      console.error('Invalid API response', response)
      alert('Failed to add transaction. Please try again.')
    }
  } catch (error) {
    console.error('Error adding transaction:', error)
    alert('An error occurred while adding the transaction.')
  }
}

const handleDeleteTransaction = async (transaction_id) => {}

const startEditing = async (transactionId, amount) => {
  editingId.value = transactionId
  editedValue.value = amount

  await nextTick()
}

const handleUpdateTransaction = async (transaction_id, transaction_type) => {}

const cancelEditing = () => {
  editingId.value = null
}

const startEditingType = async (transactionId, transactionType) => {
  editingTypeId.value = transactionId
  editedTypeValue.value = transactionType

  await nextTick()
}

const handleUpdateTransactionType = async (transaction_id, amount) => {}

const cancelEditingType = () => {
  editingTypeId.value = null
}

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return transactions.value.slice(start, end)
})

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const goToPage = () => {
  if (jumpToPage.value >= 1 && jumpToPage.value <= totalPages.value) {
    currentPage.value = jumpToPage.value
  }
}

onMounted(fetchTransactions)
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
  background-color: #2730ac;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
}

.action-button:hover {
  background-color: #323dd0;
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
</style>
