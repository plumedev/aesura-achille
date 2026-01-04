<template>
  <UDashboardGroup>
    <UDashboardPanel resizable>
      <template #body>
        <div class="h-96 p-4">
          <p>Dashboard content</p>
        </div>
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>

<script setup lang="ts">
import { resolveComponent } from 'vue'

const UDashboardGroup = resolveComponent('UDashboardGroup')
const UDashboardPanel = resolveComponent('UDashboardPanel')
</script>
