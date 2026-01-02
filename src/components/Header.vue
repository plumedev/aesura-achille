<script setup lang="ts">
import { useRouter } from 'vue-router'
import { computed, resolveComponent } from 'vue'

const router = useRouter()

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const menuItems = computed(() => [
  {
    label: 'Home',
    icon: 'i-lucide-home',
    onSelect: () => router.push('/')
  },
  {
    label: 'Mon mois',
    icon: 'i-lucide-calendar',
    onSelect: () => router.push('/my-month')
  }
])
</script>

<template>
  <UHeader title="Aesura">
    <template #left>
      <UDropdownMenu :items="menuItems" :content="{ align: 'start' }">
        <UButton icon="i-lucide-menu" color="neutral" variant="ghost" aria-label="Menu de navigation" />
      </UDropdownMenu>
    </template>

    <template #right>
      <UColorModeButton />
    </template>
  </UHeader>
</template>
