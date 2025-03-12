import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomeView.vue'
import Login from '../views/LoginView.vue'
import Register from '../views/RegisterView.vue'

const routes = [
  { path: '/', name: 'Home', component: Home, meta: { requiresAuth: true } },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const isAuthenticated = await checkAuthStatus()

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if ((to.path === '/login' || to.path === '/register') && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

async function checkAuthStatus() {
  const token = sessionStorage.getItem('session_id')
  if (!token) return false

  try {
    const response = await fetch('/api/auth/check', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.ok
  } catch (error) {
    return false
  }
}

export default router
