// Import global CSS styles
import './assets/main.css'

// Import core Vue 3 functions
import { createApp } from 'vue'
import { createPinia } from 'pinia' // State management library

// Import root component and router configuration
import App from './App.vue'
import router from './router'

// Create a Vue application instance
const app = createApp(App)

// Register Pinia (state management) with the app
app.use(createPinia())

// Register Vue Router with the app
app.use(router)

// Mount the app to the DOM element with id="app"
app.mount('#app')
