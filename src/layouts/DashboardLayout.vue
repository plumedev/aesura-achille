<template>
  <UDashboardGroup>
    <UDashboardSidebar>
      <div class="p-4">
        <p>Sidebar content</p>
      </div>
    </UDashboardSidebar>

    <UDashboardPanel>
      <template #header>
        <UDashboardNavbar>
          <template #left>
            <nav class="flex gap-4">
              <RouterLink
                v-for="item in navigationItems"
                :key="item.to"
                :to="item.to"
                class="px-3 py-2 rounded-md text-sm font-medium transition-colors"
                :class="{
                  'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300': isActive(item.to),
                  'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800': !isActive(item.to)
                }"
              >
                {{ item.label }}
              </RouterLink>
            </nav>
          </template>
        </UDashboardNavbar>
      </template>

      <template #body>
        <RouterView />
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import RouteName from '@/router/RouteName'

const router = useRouter()
const route = useRoute()

const navigationItems = computed(() => {
  return router.getRoutes()
    .filter(route => route.meta?.requiresAuth && route.name !== RouteName.NOT_FOUND)
    .map(route => ({
      label: route.meta?.title as string || route.name as string,
      to: route.path
    }))
})

const isActive = (path: string) => {
  return route.path === path
}
</script>

