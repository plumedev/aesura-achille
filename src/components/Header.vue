<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Mon mois',
    to: '/home',
    active: route.path.startsWith('/home'),
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
