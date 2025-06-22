<template>
  <div class="container">
    <div class="table-container">
      <table>
        <colgroup>
          <col />
          <col />
          <col style="width: 200px" />
        </colgroup>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Settings</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="user">
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>
              <!-- Toggle Buttons -->
              <div class="button-group">
                <button @click="toggleSection('password')">Password Change</button>
                <button @click="toggleSection('country')">Country Setting</button>
              </div>

              <!-- Password Change Section -->
              <div v-if="showPasswordSection" class="password-wrapper">
                <label for="password">New Password</label><br />
                <input
                  id="password"
                  type="password"
                  v-model="password"
                  placeholder="Enter new password"
                  class="password-input"
                />
              </div>
              <!-- Country & Timezone Section -->
              <div v-if="showCountrySection">
                <select v-model="country" class="select-box">
                  <option disabled value="">
                    {{ country || 'Please Select Country' }}
                  </option>
                  <option v-for="c in countries" :key="c.code" :value="c.name">
                    {{ c.name }}
                  </option>
                </select>

                <select
                  v-if="timezones.length > 0"
                  v-model="timezone"
                  class="select-box country-select"
                >
                  <option disabled value="">
                    {{ timezone || 'Please Select Timezone' }}
                  </option>
                  <option v-for="tz in timezones" :key="tz" :value="tz">
                    {{ tz }}
                  </option>
                </select>
              </div>

              <!-- Update Button -->
              <button
                v-if="showPasswordSection || showCountrySection"
                @click="handleUpdateUser"
                class="update-button"
              >
                Update User Info
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { fetchCountries } from '../api/countries'
import { getUserData, updateUserData } from '../api/user'
import { getCookie, setCookie } from 'typescript-cookie'

// Reactive states
const user = ref(null)
const countries = ref([])
const country = ref('')
const timezone = ref('')
const password = ref('')
const showPasswordSection = ref(false)
const showCountrySection = ref(false)

// Computed: find country object based on selected name
const selectedCountry = computed(() => {
  return countries.value.find((c) => c.name === country.value)
})

// Computed: get timezones list from selected country
const timezones = computed(() => {
  return selectedCountry.value?.timezone || []
})

function toggleSection(section) {
  if (section === 'password') {
    showPasswordSection.value = !showPasswordSection.value
    showCountrySection.value = false
  } else if (section === 'country') {
    showCountrySection.value = !showCountrySection.value
    showPasswordSection.value = false
  }
}

// Load user and country info
const fetchUser = async () => {
  const response = await getUserData()
  user.value = response.data

  // Load countries
  await fetchCountryList()

  // Restore from cookie
  const savedCountry = getCookie('user-country')
  const savedTimezone = getCookie('user-timezone')

  if (savedCountry && countries.value.some((c) => c.name === savedCountry)) {
    country.value = savedCountry

    // Wait for timezone options to be ready
    await nextTick()

    if (savedTimezone && timezones.value.includes(savedTimezone)) {
      timezone.value = savedTimezone
    }
  }
}

// Load countries from backend
const fetchCountryList = async () => {
  const response = await fetchCountries()
  const rawCountries = response?.data || []

  // Sort alphabetically
  countries.value = rawCountries.sort((a, b) => a.name.localeCompare(b.name))
}

// Submit updated country & timezone
const handleUpdateUser = async () => {
  if (!user.value) return
  const fieldsToUpdate = {}
  if (showPasswordSection.value && password.value) {
    fieldsToUpdate.password = password.value
  }
  if (showCountrySection.value) {
    fieldsToUpdate.country = country.value
    fieldsToUpdate.timezone = timezone.value
  }
  try {
    await updateUserData(user.value.id, fieldsToUpdate)
    password.value = ''
    showPasswordSection.value = false
    showCountrySection.value = false
  } catch (err) {
    console.error('Failed to update user:', err)
    alert('Failed to update user info')
  }
}

// Lifecycle: load on mount
onMounted(async () => {
  await fetchUser()
})

// Watchers: sync cookie
watch(country, (newVal) => {
  setCookie('user-country', newVal, {
    path: '/',
    sameSite: 'none',
    secure: true,
  })
  timezone.value = '' // Reset timezone on country change
})

watch(timezone, (newVal) => {
  setCookie('user-timezone', newVal)
})
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
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.create-user-button {
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

.user-type-button,
.user-type-input {
  min-width: 100px;
  width: auto;
  padding: 8px 12px;
  text-align: center;
}

.user-type-input {
  border: 1px solid #444;
  border-radius: 5px;
  background-color: #333;
  color: white;
}

.user-form {
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
  gap: 10px;
  margin-bottom: 10px;
}
.password-wrapper {
  margin-bottom: 10px;
}
.password-input,
.select-box,
.country-select {
  width: 180px;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #444;
  border-radius: 5px;
  background-color: #333;
  color: #fff;
}
.country-select {
  margin-left: 10px;
}
.update-button {
  margin-top: 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
}
.update-button:hover {
  background-color: #0056b3;
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

.select-box {
  width: 180px;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #444;
  border-radius: 5px;
  background-color: #333;
  color: #fff;
  cursor: pointer;
  outline: none;
  transition: border 0.2s ease;
}

.select-box:focus {
  border: 1px solid #007bff;
}

option {
  background-color: #1e1e1e;
  color: #ffffffd4;
}

.password-wrapper {
  margin-bottom: 10px;
}

.password-input {
  width: 180px;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #444;
  border-radius: 5px;
  background-color: #333;
  color: #fff;
}

@media (max-width: 768px) {
  .container {
    justify-content: flex-start;
    padding-top: 1rem;
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
}
</style>
