import { createRouter, createWebHistory } from 'vue-router'
import { AuthCheck } from '../api/auth.ts'
import Home from '../views/HomeView.vue'
import Login from '../views/LoginView.vue'
import Register from '../views/RegisterView.vue'
import { useAuthStore } from '@/stores/auth'

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
  const authStore = useAuthStore()

  const isAuthenticated = await AuthCheck()
  console.log('isAuthenticated', isAuthenticated)

  if (!isAuthenticated) {
    authStore.user = null
    localStorage.removeItem('user')
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
