<template>
  <!-- Outer container for the entire transaction interface -->
  <div class="container">
    <!-- Container for the transaction table and filters -->
    <div class="table-container">
      <!-- Buttons to filter transactions by type -->
      <!-- <div class="filter-transaction-type">
        <button @click="filterType = 'All'">All</button>
        <button @click="filterType = 'Income'">Income</button>
        <button @click="filterType = 'Expense'">Expense</button>
        <button @click="filterType = 'InternalTransfer'">Internal Transfer</button>
      </div> -->

      <!-- Table to display paginated transactions -->
      <table>
        <tbody>
          <template v-for="[date, transactions] in groupedTransactions" :key="date">
            <tr @click="toggleDate(date)" class="date-row">
              <td colspan="4" class="date-row">
                <div class="summary-labels">
                  {{ date }} ({{ transactions.length }} rows)
                  <span class="summary-income">
                    ${{ dailyTotals.get(date)?.Income ?? '0.00' }}
                  </span>
                  <span class="summary-expense">
                    ${{ dailyTotals.get(date)?.Expense ?? '0.00' }}
                  </span>
                </div>
              </td>
            </tr>

            <tr
              v-for="transaction in expandedDates.has(date) ? transactions : []"
              :key="transaction.id"
              class="transaction-row"
            >
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
              <td>
                <span
                  v-if="editingId !== transaction.id"
                  :class="['amount-display', transaction.transaction_type]"
                  @click="startEditing(transaction.id, transaction.amount, 'amount')"
                >
                  {{
                    (transaction.transaction_type === 'Income'
                      ? '+'
                      : transaction.transaction_type === 'Expense'
                        ? '-'
                        : '') +
                    transaction.amount +
                    '(' +
                    transaction.fee +
                    ')'
                  }}
                </span>
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

              <td>
                <span
                  v-if="editingId !== transaction.id || editingField !== 'notes'"
                  @click="startEditing(transaction.id, transaction.notes, 'notes')"
                >
                  {{ transaction.notes || '-' }}
                </span>
                <input
                  v-else
                  v-model="editedValue"
                  type="text"
                  @keyup.enter="updateTransactionField(transaction.id, 'notes', editedValue)"
                  @blur="cancelEditing"
                />
              </td>
              <td>
                <button class="action-button" @click="handleDeleteTransaction(transaction.id)">
                  <font-awesome-icon :icon="['fas', 'trash']" />
                </button>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Button to open create form -->
    <button v-if="!showForm" @click="showForm = true" class="create-transaction-button">
      <font-awesome-icon :icon="['fas', 'plus']" />
    </button>

    <!-- Pagination controls -->
    <Pagination
      :currentPage="currentPage"
      :totalPages="totalPages"
      :itemsPerPage="itemsPerPage"
      @update:currentPage="(val) => (currentPage = val)"
      @update:itemsPerPage="(val) => (itemsPerPage = val)"
    />

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
import Pagination from './Pagination.vue'
import dayjs from 'dayjs'

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

const expandedDates = ref(new Set())

const toggleDate = (date) => {
  if (expandedDates.value.has(date)) {
    expandedDates.value.delete(date)
  } else {
    expandedDates.value.add(date)
  }
}

const groupedTransactionsRaw = computed(() => {
  const groups = {}
  for (const tx of filteredTransactions.value) {
    const date = dayjs(tx.transaction_time).format('YYYY-MM-DD')
    if (!groups[date]) groups[date] = []
    groups[date].push(tx)
  }

  const sorted = Object.entries(groups).sort(([a], [b]) => (a < b ? 1 : -1)) // 日期新到舊
  return sorted
})

const groupedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return groupedTransactionsRaw.value.slice(start, end)
})

const dailyTotals = computed(() => {
  const map = new Map()
  for (const tx of filteredTransactions.value) {
    const date = dayjs(tx.transaction_time).format('YYYY-MM-DD')
    if (!map.has(date)) {
      map.set(date, { Income: 0, Expense: 0, InternalTransfer: 0 })
    }
    const category = tx.transaction_type
    map.get(date)[category] += Number(tx.amount || 0)
  }

  for (const [date, totals] of map.entries()) {
    map.set(date, {
      Income: totals.Income.toFixed(2),
      Expense: totals.Expense.toFixed(2),
      InternalTransfer: totals.InternalTransfer.toFixed(2),
    })
  }

  return map
})

// === Pagination ===
const currentPage = ref(1)
const itemsPerPage = ref(parseInt(getCookie('itemsPerPage') || '10', 10))

const totalPages = computed(() =>
  Math.ceil(groupedTransactionsRaw.value.length / itemsPerPage.value),
)

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredTransactions.value.slice(start, end)
})

// === Filtering by Transaction Type ===
const filterType = ref('All')
watch(filterType, () => {
  currentPage.value = 1
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
      transactions.value = response.data.reverse()
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
      // Clear form
      newAmount.value = ''
      newToAssetId.value = ''
      newTransactionTime.value = ''
      newNotes.value = ''
      showIncome.value = false
      showForm.value = false
      showIncome.value = false
      await fetchTransactions()
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
      newAmount.value = ''
      newFromAssetId.value = ''
      newTransactionTime.value = ''
      newNotes.value = ''
      showIncome.value = false
      showForm.value = false
      showExpense.value = false
      await fetchTransactions()
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
      newFromAssetId.value = ''
      newToAssetId.value = ''
      newFee.value = ''
      newAmount.value = ''
      newTransactionTime.value = ''
      newNotes.value = ''
      showForm.value = false
      showInternalTransfer.value = false
      await fetchTransactions()
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
    await fetchTransactions()
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
    await fetchTransactions()
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

/* === filter buttons === */
.filter-transaction-type {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px auto;
  background-color: #1e1e1e;
  border-radius: 8px;
  overflow: hidden;
}

.table-container table {
  width: 100%;
  border-collapse: collapse;
}

.table-container thead {
  position: sticky;
  top: 0;
  background-color: #333;
  z-index: 10;
}

/* === inputs & selects === */
input,
select {
  width: 250px;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #444;
  border-radius: 5px;
  background-color: #333;
  color: white;
  box-sizing: border-box;
}

option {
  background-color: #2e2e2e;
  color: #ccc;
}

/* === buttons === */
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
  border: 1px solid #444;
  padding: 10px 0px 10px 10px;
  text-align: center;
  font-size: 1rem;
}

.create-transaction-button {
  margin-top: 20px;
  width: auto;
}

/* === delete button === */
.action-button {
  background-color: #d9534f;
  padding: 5px 10px;
}
.action-button:hover {
  background-color: #c9302c;
}

/* === forms === */
.transaction-form {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 0 auto 20px;
}

.create-transaction-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.create-transaction-form-wrapper {
  width: 400px;
  background-color: #2e2e2e;
  border-radius: 8px;
  padding: 20px;
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

.form-group input:focus {
  border-color: #007bff;
}

.cancel-button {
  background-color: #d9534f;
  margin-top: 10px;
}
.cancel-button:hover {
  background-color: #c9302c;
}

/* === amount display coloring === */
.amount-display.Income {
  color: #00bfff;
  font-weight: bold;
  cursor: pointer;
}
.amount-display.Expense {
  color: #ff4d4f;
  font-weight: bold;
  cursor: pointer;
}
.amount-display.InternalTransfer {
  color: #fff;
  font-weight: bold;
  cursor: pointer;
}

/* ============== MOBILE (<=768px) ============== */
@media (max-width: 768px) {
  .container {
    padding: 1rem 0.5rem;
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
.summary-labels {
  display: grid;
  grid-template-columns: auto 1fr 1fr 1fr auto;
  column-gap: 10px;
  align-items: center;
  width: 100%;
  margin-top: 4px;
  font-size: 0.9rem;
}
.summary-income,
.summary-expense,
.summary-internal {
  text-align: left;
}

.summary-income {
  color: #00bfff;
  font-weight: bold;
}

.summary-expense {
  color: #ff4d4f;
  font-weight: bold;
}

.summary-internal {
  color: #ffffff;
  font-weight: bold;
  opacity: 0.8;
}

.date-row td {
  text-align: left;
}
</style>
