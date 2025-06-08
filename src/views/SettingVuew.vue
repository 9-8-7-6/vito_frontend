<template>
  <div class="container">
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Country</th>
          </tr>
        </thead>
        <tbody>
          <!-- Display user info once loaded -->
          <tr v-if="user">
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>
              <!-- Country dropdown -->
              <select v-model="country" class="select-box">
                <option disabled value="">
                  {{ country || 'Please Select Country' }}
                </option>
                <option v-for="c in countries" :key="c.code" :value="c.name">
                  {{ c.name }}
                </option>
              </select>

              <!-- Timezone dropdown (only if country has timezones) -->
              <select
                v-if="timezones.length > 0"
                v-model="timezone"
                class="select-box"
                style="margin-left: 10px"
              >
                <option disabled value="">
                  {{ timezone || 'Please Select Timezone' }}
                </option>
                <option v-for="tz in timezones" :key="tz" :value="tz">
                  {{ tz }}
                </option>
              </select>

              <!-- Display selected timezone -->
              <div v-if="timezone" style="margin-top: 10px">TimeZone: {{ timezone }}</div>

              <!-- Update button -->
              <button @click="handleUpdateUser" style="margin-top: 10px">Update User Info</button>
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

// Computed: find country object based on selected name
const selectedCountry = computed(() => {
  return countries.value.find((c) => c.name === country.value)
})

// Computed: get timezones list from selected country
const timezones = computed(() => {
  return selectedCountry.value?.timezone || []
})

// Load user and country info
const fetchUser = async () => {
  const response = await getUserData()
  user.value = response.data

  // Load countries
  await fetchCountryList()

  // Restore from cookie (if any)
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

  const fieldsToUpdate = {
    country: country.value,
    timezone: timezone.value,
  }

  try {
    const response = await updateUserData(user.value.id, fieldsToUpdate)
    console.log('User updated:', response?.data)
    alert('User info updated successfully!')
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
  color: #fff;
}
</style>
