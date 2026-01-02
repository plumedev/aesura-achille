<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import RouteName from '@/router/RouteName'

const route = useRoute()

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Home',
    to: '/',
    active: route.name === RouteName.HOME,
  },
  {
    label: 'Mon mois',
    to: '/my-month',
    active: route.name === RouteName.MY_MONTH,
  }
])
</script>

<template>
  <UHeader title="Aesura">

    <UNavigationMenu :items="items" color="primary" class="text-primary" highlight />

    <template #right>
      <UColorModeButton />
    </template>
  </UHeader>
</template>
