import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import RouteName from './RouteName'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: RouteName.ROOT,
    redirect: {
      name: RouteName.HOME
    }
  },
  {
    path: '/home',
    name: RouteName.HOME,
    component: () => import('../views/home-view/HomeView.vue'),
    meta: {
      title: 'Accueil'
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
