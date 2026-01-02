import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import RouteName from './RouteName'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
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
