import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import RouteName from './RouteName'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: RouteName.HOME,
    component: () => import('../views/home-view/HomeView.vue'),
    meta: {
      title: 'Accueil'
    }
  },
  {
    path: '/import-previous-month',
    name: RouteName.IMPORT_PREVIOUS_MONTH,
    component: () => import('../views/import-view/ImportPreviousMonthView.vue'),
    meta: {
      title: 'Importer mois précédent'
    }
  },
  {
    path: '/my-month',
    name: RouteName.MY_MONTH,
    component: () => import('../views/my-month-view/MyMonthView.vue'),
    meta: {
      title: 'Mon mois'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - Aesura`
  }
  return true
})

export default router
