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
import CurrencyHolding from '../views/CurrencyHoldingView.vue'

import { useAuthStore } from '@/stores/auth'

// Define all routes in the application
const routes = [
  { path: '/', name: 'Home', component: Home, meta: { requiresAuth: true, title: 'Home - Vito' } },
  { path: '/login', name: 'Login', component: Login, meta: { title: 'Accounts: Sign in - Vito' } },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { title: 'Accounts: Sign up - Vito' },
  },
  {
    path: '/asset',
    name: 'Asset',
    component: Asset,
    meta: { requiresAuth: true, title: 'Asset - Vito' },
  },
  {
    path: '/setting',
    name: 'Setting',
    component: Setting,
    meta: { requiresAuth: true, title: 'Setting - Vito' },
  },
  {
    path: '/stock',
    name: 'Stock',
    component: Stock,
    meta: { requiresAuth: true, title: 'Stock - Vito' },
  },
  {
    path: '/transaction',
    name: 'Transaction',
    component: Transaction,
    meta: { requiresAuth: true, title: 'Transaction - Vito' },
  },
  {
    path: '/currency-holding',
    name: 'Currency holding',
    component: CurrencyHolding,
    meta: { requiresAuth: true, title: 'Currency - Vito' },
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

  document.title = (to.meta.title as string) || 'Vito App'

  if ((to.path === '/login' || to.path === '/register') && isAuthenticated) {
    return { path: '/' }
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    return { path: '/login' }
  }

  return true
})

export default router
