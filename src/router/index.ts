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
  console.log('isAuthenticated', isAuthenticated)
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

async function checkAuthStatus() {
  const token = getCookie('id')
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

function getCookie(name: String) {
  const cookies = document.cookie.split('; ')
  const cookie = cookies.find((row) => row.startsWith(name + '='))
  return cookie ? cookie.split('=')[1] : null
}

export default router
