<template>
  <UDashboardGroup>
    <UDashboardSidebar>
      <UHeader title="Aesura" to="/" class="cursor-pointer border-none" />
      <UNavigationMenu :items="navigationMenuItems" orientation="vertical" />
    </UDashboardSidebar>

    <UDashboardPanel>
      <template #header>
        <UDashboardToolbar>
          <template #left>
            <div id="dashboard-toolbar-left" class="flex items-center gap-2"></div>
            <div id="dashboard-toolbar-right" class="flex items-center gap-2"></div>
          </template>
        </UDashboardToolbar>
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

const navigationMenuItems = computed(() => {
  const currentRoute = route
  return router.getRoutes()
    .filter(r => r.meta?.requiresAuth && r.name !== RouteName.NOT_FOUND)
    .map(r => ({
      label: r.meta?.title as string || r.name as string,
      to: r.path,
      active: currentRoute.path === r.path,
      icon: r.meta?.icon as string
    }))
})
</script>
