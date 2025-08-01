<template>
  <div class="container">
    <div class="table-container">
      <!-- Asset table, hidden when form is shown -->
      <table v-if="showTable">
        <thead>
          <tr>
            <th>
              <div>Assets</div>
              <div class="profit">{{ asset_sum }}</div>
            </th>
            <th @click="reverseAssetOrder">
              <div>Liabilities</div>
              <div class="loss">{{ liabilities_sum }}</div>
            </th>
            <th>
              <div>Total</div>
              <div class="neutral">{{ total }}</div>
            </th>
          </tr>
        </thead>

        <tbody>
          <!-- Display assets -->
          <tr v-for="asset in assets" :key="asset.id">
            <!-- Asset type editing logic -->
            <td>
              <div v-click-outside="cancelEditingType" class="asset-type-wrapper">
                <input
                  v-if="editingTypeId === asset.id"
                  ref="typeInput"
                  class="asset-type-input"
                  v-model="editedTypeValue"
                  @keyup.enter="handleUpdateAssetType(asset.id)"
                  @blur="cancelEditingType"
                />
                <span
                  v-else
                  class="asset-type-button"
                  @click="startEditingType(asset.id, asset.asset_type)"
                >
                  {{ asset.asset_type }}
                </span>
              </div>
            </td>

            <!-- Asset balance editing logic -->
            <td>
              <input
                v-if="editingId === asset.id"
                v-model="editedValue"
                type="number"
                @keyup.enter="handleUpdateAsset(asset.id)"
                @blur="cancelEditing"
              />
              <span
                v-else
                :class="{
                  profit: asset.balance > 0,
                  loss: asset.balance < 0,
                  neutral: asset.balance === 0,
                }"
                @click="startEditing(asset.id, asset.balance)"
              >
                {{ asset.balance > 0 ? '+' + asset.balance : asset.balance }}
              </span>
            </td>

            <!-- Delete button -->
            <td>
              <IconButton
                :icon="['fas', 'trash']"
                @click="
                  () => {
                    deletingId = asset.id
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

    <!-- Create button, shows form and hides table -->
    <button v-if="!showForm" @click="openForm" class="create-asset-button">
      <font-awesome-icon :icon="['fas', 'plus']" />
    </button>

    <!-- New asset form -->
    <div v-if="showForm" class="asset-form">
      <label for="asset_type">Asset Type:</label>
      <input id="asset_type" v-model="newAssetType" placeholder="Enter asset type" />

      <label for="balance">Balance:</label>
      <input id="balance" v-model="newBalance" type="number" placeholder="Enter balance" />

      <div class="button-group">
        <button @click="createAsset">Create Asset</button>
        <button @click="closeForm" class="cancel-button">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { getAsset, addAsset, deleteAsset, updateAsset } from '../api/asset'
import { fetchStockHoldingsByAccount } from '../api/stock'
import { fetchCurrencyHoldingsByAccount } from '../api/currency_holding'
import { currencyScraper } from '../api/currency_crawer'
import IconButton from '@/components/IconButton.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

// State: Asset list and form inputs
const assets = ref([])
const newAssetType = ref('')
const newBalance = ref('')

// Editing state
const editingId = ref(null)
const editedValue = ref('')
const editingTypeId = ref(null)
const editedTypeValue = ref('')

// Control visibility
const showForm = ref(false)
const showTable = ref(true)
const showConfirm = ref(false)
const deletingId = ref(null)

const onConfirmDelete = async () => {
  showConfirm.value = false
  await handleDeleteAsset(deletingId.value)
  deletingId.value = null
}

// Toggle form/table view
const openForm = () => {
  showForm.value = true
  showTable.value = false
}
const closeForm = () => {
  showForm.value = false
  showTable.value = true
}

const sortDesc = ref(true)

const fetchAssets = async () => {
  try {
    const response = await getAsset()
    assets.value = response?.data || []

    // Stock holdings
    const stock_response = await fetchStockHoldingsByAccount()
    const stockData = stock_response?.data || []

    // Currency holdings
    const Currency_holding_response = await fetchCurrencyHoldingsByAccount()
    const CurrencyHoldingData = Currency_holding_response || []

    let stockTotal = 0
    for (const stock of stockData) {
      const price = parseFloat(stock.current_price)
      const quantity = parseFloat(stock.quantity)
      stockTotal += price * quantity * 0.995575
    }

    // Create virtual asset for stock
    const stockAsset = {
      id: 'virtual-stock-asset',
      account_id: stockData[0]?.account_id ?? '',
      asset_type: 'Stock - TW',
      balance: stockTotal.toFixed(2),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    assets.value.push(stockAsset)

    const currencyCodes = CurrencyHoldingData.map((c) => c.currency_code)
    const exchangeMap = await currencyScraper(currencyCodes)

    // Convert each currency holding into a virtual asset
    for (const currency of CurrencyHoldingData) {
      const code = currency.currency_code
      const current_price_per_unit = exchangeMap[code] ?? 0
      const amount = parseFloat(currency.amount_held)
      const currencyAsset = {
        id: `virtual-currency-${code}`,
        account_id: currency.account_id ?? '',
        asset_type: `Currency - ${code} (${amount.toFixed(2)})`,
        balance: (amount * current_price_per_unit).toFixed(2),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      assets.value.push(currencyAsset)
    }

    // Sort by balance (high to low)
    assets.value.sort((a, b) => parseFloat(b.balance) - parseFloat(a.balance))
    sortDesc.value = true
  } catch (error) {
    console.error('Error fetching assets:', error)
  }
}

const reverseAssetOrder = async () => {
  assets.value.sort((a, b) => (sortDesc.value ? b.balance - a.balance : a.balance - b.balance))
  sortDesc.value = !sortDesc.value
}

// Create asset API call
const createAsset = async () => {
  if (!newAssetType.value || newBalance.value === '') {
    alert('Please enter both Asset Type and Balance!')
    return
  }
  try {
    const response = await addAsset(newAssetType.value, parseFloat(newBalance.value))
    assets.value.push(response.data)
    newAssetType.value = ''
    newBalance.value = ''
    closeForm()
  } catch (error) {
    console.error('Error adding asset:', error)
  }
}

// Delete asset API call
const handleDeleteAsset = async (asset_id) => {
  try {
    await deleteAsset(asset_id)
    await fetchAssets()
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
    await updateAsset(asset_id, { balance: parseFloat(editedValue.value) })
    await fetchAssets()
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
    await updateAsset(asset_id, { asset_type: editedTypeValue.value })
    await fetchAssets()
  } catch (error) {
    console.error('Error updating asset type:', error)
  } finally {
    editingTypeId.value = null
  }
}
const cancelEditingType = () => {
  editingTypeId.value = null
}

const safeNumber = (val) => {
  const n = Number(val)
  return isNaN(n) ? 0 : n
}

const asset_sum = computed(() =>
  assets.value
    .filter((a) => safeNumber(a.balance) > 0)
    .reduce((sum, a) => sum + safeNumber(a.balance), 0)
    .toFixed(2),
)
const liabilities_sum = computed(() =>
  assets.value
    .filter((a) => safeNumber(a.balance) < 0)
    .reduce((sum, a) => sum + Math.abs(safeNumber(a.balance)), 0)
    .toFixed(2),
)
const total = computed(() =>
  assets.value.reduce((sum, a) => sum + safeNumber(a.balance), 0).toFixed(2),
)

// Run on component mount
onMounted(fetchAssets)
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
  background-color: #c9302c;
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
