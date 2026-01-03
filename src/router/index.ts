import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import RouteName from './RouteName'
import { useAuthStore } from '@/stores/authStore'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: RouteName.MY_MONTH,
    component: () => import('../views/my-month-view/MyMonthView.vue'),
    meta: {
      title: 'Mon mois',
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: {
      title: 'Connexion',
      requiresAuth: false
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Mettre à jour le titre de la page
  if (to.meta.title) {
    document.title = `${to.meta.title} - Aesura`
  }

  // Vérifier si la route nécessite une authentification
  if (to.meta.requiresAuth) {
    // Attendre que l'état d'authentification soit chargé
    if (authStore.isLoading) {
      // Attendre un peu pour que l'auth se charge
      setTimeout(() => {
        if (!authStore.isAuthenticated) {
          next({ name: 'login', query: { redirect: to.fullPath } })
        } else {
          next()
        }
      }, 100)
    } else {
      if (!authStore.isAuthenticated) {
        next({ name: 'login', query: { redirect: to.fullPath } })
      } else {
        next()
      }
    }
  } else {
    // Si l'utilisateur est déjà connecté et essaie d'accéder à la page de login, rediriger vers la page d'accueil
    if (to.name === 'login' && authStore.isAuthenticated) {
      next({ path: '/' })
    } else {
      next()
    }
  }
})

export default router
