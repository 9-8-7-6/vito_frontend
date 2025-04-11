import { createRouter, createWebHistory } from 'vue-router'
import { AuthCheck } from '../api/auth.ts'
import Home from '../views/HomeView.vue'
import Login from '../views/LoginView.vue'
import Register from '../views/RegisterView.vue'
import Asset from '../views/AssetView.vue'
import Stock from '../views/StockView.vue'
import Setting from '../views/SettingVuew.vue'
import Transaction from '../views/TransactionView.vue'
import { useAuthStore } from '@/stores/auth'
import { removeCookie } from 'typescript-cookie'

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

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  const isAuthenticated = await AuthCheck()
  console.log('isAuthenticated', isAuthenticated)

  if (!isAuthenticated) {
    authStore.user = null
    localStorage.removeItem('user')
    removeCookie('id', { path: '/' })
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    console.log('User not authenticated, redirecting to /login')
    next('/login')
  } else if ((to.path === '/login' || to.path === '/register') && isAuthenticated) {
    console.log('User is authenticated, redirecting to /')
    next('/')
  } else {
    next()
  }
})

export default router
