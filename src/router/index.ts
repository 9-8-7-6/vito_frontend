import { createRouter, createWebHashHistory } from 'vue-router'
import { AuthCheck } from '../api/auth.ts'

// Import views (page components)
import Home from '../views/HomeView.vue'
import Login from '../views/LoginView.vue'
import Register from '../views/RegisterView.vue'
import Asset from '../views/AssetView.vue'
import Stock from '../views/StockView.vue'
import Setting from '../views/SettingView.vue'
import Transaction from '../views/TransactionView.vue'

import { useAuthStore } from '@/stores/auth'

// Define all routes in the application
const routes = [
  { path: '/', name: 'Home', component: Home, meta: { requiresAuth: true } },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/asset', name: 'Asset', component: Asset, meta: { requiresAuth: true } },
  { path: '/setting', name: 'Setting', component: Setting, meta: { requiresAuth: true } },
  { path: '/stock', name: 'Stock', component: Stock, meta: { requiresAuth: true } },
  {
    path: '/transaction',
    name: 'Transaction',
    component: Transaction,
    meta: { requiresAuth: true },
  },
]

// Create the router instance with history mode
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

// Navigation guard to check auth before each route
router.beforeEach(async (to) => {
  const isAuthenticated = await AuthCheck()
  if ((to.path === '/login' || to.path === '/register') && isAuthenticated) {
    return { path: '/' }
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    return { path: '/login' }
  }

  return true
})

export default router
