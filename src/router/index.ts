import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
  type NavigationGuardNext,
  type RouteLocationNormalized
} from 'vue-router'
import RouteName from './RouteName'
import { useAuthStore } from '@/stores/authStore'
import { watch } from 'vue'

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
    path: '/dashboard',
    name: RouteName.DASHBOARD,
    component: () => import('../views/dashboard-view/DashboardView.vue'),
    meta: {
      title: 'Dashboard',
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

router.beforeEach(async (to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const authStore = useAuthStore()

  // Mettre à jour le titre de la page
  if (to.meta.title) {
    document.title = `${to.meta.title} - Aesura`
  }

  // Attendre que l'état d'authentification soit chargé
  if (authStore.isLoading) {
    // Attendre que isLoading devienne false en utilisant watch
    await new Promise<void>((resolve) => {
      const stopWatcher = watch(
        () => authStore.isLoading,
        (isLoading) => {
          if (!isLoading) {
            stopWatcher()
            resolve()
          }
        },
        { immediate: true }
      )

      // Timeout de sécurité (max 3 secondes)
      setTimeout(() => {
        stopWatcher()
        resolve()
      }, 3000)
    })
  }

  // Vérifier si la route nécessite une authentification
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      next({ name: 'login', query: { redirect: to.fullPath } })
    } else {
      next()
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
