// Import global CSS styles
import './assets/main.css'

// Import core Vue 3 functions
import { createApp } from 'vue'
import { createPinia } from 'pinia' // State management library
import axios from 'axios'

// Import root component and router configuration
import App from './App.vue'
import router from './router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPlus, faTrash, faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons'

library.add(faPlus, faTrash, faArrowRight, faArrowLeft)

// Create a Vue application instance
const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)

axios.defaults.withCredentials = true

// Register Pinia (state management) with the app
app.use(createPinia())

// Register Vue Router with the app
app.use(router)

// Mount the app to the DOM element with id="app"
app.mount('#app')
