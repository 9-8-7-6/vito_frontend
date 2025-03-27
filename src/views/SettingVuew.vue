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
          <tr v-if="user">
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>
              <select v-model="country" class="select-box">
                <option disabled value="">Please Select Country</option>
                <option v-for="c in countryList" :key="c" :value="c">
                  {{ c }}
                </option>
              </select>

              <select
                v-if="selectedRegions"
                v-model="region"
                class="select-box"
                style="margin-left: 10px"
              >
                <option disabled value="">Please Select Region</option>
                <option v-for="r in selectedRegions" :key="r.name" :value="r.name">
                  {{ r.name }}
                </option>
              </select>

              <div v-if="timeZone" style="margin-top: 10px">TimeZone: {{ timeZone }}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { getUserData, updateUserData } from '../api/user'

const user = ref(null)
const editing = ref(false)
const editedValue = ref('')

const countryList = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'American Samoa',
  'Andorra',
  'Angola',
  'Anguilla',
  'Antarctica',
  'Antigua and Barbuda',
  'Argentina',
  'Armenia',
  'Aruba',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas (the)',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bermuda',
  'Bhutan',
  'Bolivia (Plurinational State of)',
  'Bonaire, Sint Eustatius and Saba',
  'Bosnia and Herzegovina',
  'Botswana',
  'Bouvet Island',
  'Brazil',
  'British Indian Ocean Territory (the)',
  'Brunei Darussalam',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cabo Verde',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Cayman Islands (the)',
  'Central African Republic (the)',
  'Chad',
  'Chile',
  'China',
  'Christmas Island',
  'Cocos (Keeling) Islands (the)',
  'Colombia',
  'Comoros (the)',
  'Congo (the Democratic Republic of the)',
  'Congo (the)',
  'Cook Islands (the)',
  'Costa Rica',
  'Croatia',
  'Cuba',
  'Curaçao',
  'Cyprus',
  'Czechia',
  "Côte d'Ivoire",
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic (the)',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Eswatini',
  'Ethiopia',
  'Falkland Islands (the) [Malvinas]',
  'Faroe Islands (the)',
  'Fiji',
  'Finland',
  'France',
  'French Guiana',
  'French Polynesia',
  'French Southern Territories (the)',
  'Gabon',
  'Gambia (the)',
  'Georgia',
  'Germany',
  'Ghana',
  'Gibraltar',
  'Greece',
  'Greenland',
  'Grenada',
  'Guadeloupe',
  'Guam',
  'Guatemala',
  'Guernsey',
  'Guinea',
  'Guinea-Bissau',
  'Guyana',
  'Haiti',
  'Heard Island and McDonald Islands',
  'Holy See (the)',
  'Honduras',
  'Hong Kong',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran (Islamic Republic of)',
  'Iraq',
  'Ireland',
  'Isle of Man',
  'Israel',
  'Italy',
  'Jamaica',
  'Japan',
  'Jersey',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kiribati',
  "Korea (the Democratic People's Republic of)",
  'Korea (the Republic of)',
  'Kuwait',
  'Kyrgyzstan',
  "Lao People's Democratic Republic (the)",
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Macao',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Marshall Islands (the)',
  'Martinique',
  'Mauritania',
  'Mauritius',
  'Mayotte',
  'Mexico',
  'Micronesia (Federated States of)',
  'Moldova (the Republic of)',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Montserrat',
  'Morocco',
  'Mozambique',
  'Myanmar',
  'Namibia',
  'Nauru',
  'Nepal',
  'Netherlands (the)',
  'New Caledonia',
  'New Zealand',
  'Nicaragua',
  'Niger (the)',
  'Nigeria',
  'Niue',
  'Norfolk Island',
  'Northern Mariana Islands (the)',
  'Norway',
  'Oman',
  'Pakistan',
  'Palau',
  'Palestine, State of',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines (the)',
  'Pitcairn',
  'Poland',
  'Portugal',
  'Puerto Rico',
  'Qatar',
  'Republic of North Macedonia',
  'Romania',
  'Russian Federation (the)',
  'Rwanda',
  'Réunion',
  'Saint Barthélemy',
  'Saint Helena, Ascension and Tristan da Cunha',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Saint Martin (French part)',
  'Saint Pierre and Miquelon',
  'Saint Vincent and the Grenadines',
  'Samoa',
  'San Marino',
  'Sao Tome and Principe',
  'Saudi Arabia',
  'Senegal',
  'Serbia',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Sint Maarten (Dutch part)',
  'Slovakia',
  'Slovenia',
  'Solomon Islands',
  'Somalia',
  'South Africa',
  'South Georgia and the South Sandwich Islands',
  'South Sudan',
  'Spain',
  'Sri Lanka',
  'Sudan (the)',
  'Suriname',
  'Svalbard and Jan Mayen',
  'Sweden',
  'Switzerland',
  'Syrian Arab Republic',
  'Taiwan',
  'Tajikistan',
  'Tanzania, United Republic of',
  'Thailand',
  'Timor-Leste',
  'Togo',
  'Tokelau',
  'Tonga',
  'Trinidad and Tobago',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Turks and Caicos Islands (the)',
  'Tuvalu',
  'Uganda',
  'Ukraine',
  'United Arab Emirates (the)',
  'United Kingdom of Great Britain and Northern Ireland (the)',
  'United States Minor Outlying Islands (the)',
  'United States of America (the)',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Venezuela (Bolivarian Republic of)',
  'Viet Nam',
  'Virgin Islands (British)',
  'Virgin Islands (U.S.)',
  'Wallis and Futuna',
  'Western Sahara',
  'Yemen',
  'Zambia',
  'Zimbabwe',
  'Åland Islands',
]

const regionData = {
  Taiwan: [
    { name: 'Taipei', timeZone: 'Asia/Taipei' },
    { name: 'Kaohsiung', timeZone: 'Asia/Taipei' },
  ],
  Japan: [
    { name: 'Tokyo', timeZone: 'Asia/Tokyo' },
    { name: 'Osaka', timeZone: 'Asia/Tokyo' },
  ],
  'United States of America (the)': [
    { name: 'New York', timeZone: 'America/New_York' },
    { name: 'Los Angeles', timeZone: 'America/Los_Angeles' },
  ],
}

const country = ref('')
const region = ref('')

const selectedRegions = computed(() => {
  return regionData[country.value] || []
})

const selectedCountry = computed(() => {
  return countries.find((c) => c.name === country.value)
})

const selectedRegion = computed(() => {
  return selectedCountry.value?.regions.find((r) => r.name === region.value)
})

const timeZone = computed(() => {
  const regions = selectedRegions.value
  const found = regions.find((r) => r.name === region.value)
  return found?.timeZone || ''
})

const fetchUser = async () => {
  const response = await getUserData()
  user.value = response.data

  const savedCountry = localStorage.getItem('user-country')
  const savedRegion = localStorage.getItem('user-region')

  if (savedCountry) country.value = savedCountry
  if (savedRegion) region.value = savedRegion
}

const startEdit = () => {
  editing.value = true
  editedValue.value = user.value.balance.toString()
}

const cancelEdit = () => {
  editing.value = false
}

const updateBalance = async () => {
  const updatedFields = { balance: parseFloat(editedValue.value) }
  const response = await updateUserData(user.value.id, updatedFields)
  if (response) {
    user.value.balance = updatedFields.balance
    editing.value = false
  }
}

onMounted(fetchUser)

watch(country, (newVal) => {
  localStorage.setItem('user-country', newVal)

  if (!regionData[newVal]) {
    region.value = ''
    localStorage.setItem('user-region', '')
  }
})

watch(region, (newVal) => {
  localStorage.setItem('user-region', newVal)
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
