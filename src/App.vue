<template>
  <UApp>
    <Analytics />
    <StyleProvider>
      <ModalProvider />
      <div class="min-h-screen bg-default">
        <template v-if="route.meta.requiresAuth">
          <DashboardLayout />
        </template>
        <template v-else>
          <Header />
          <RouterView />
        </template>
      </div>
    </StyleProvider>
  </UApp>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import StyleProvider from './providers/StyleProvider.vue'
import ModalProvider from './providers/ModalProvider.vue'
import Header from './components/Header.vue'
import DashboardLayout from './layouts/DashboardLayout.vue'
import { Analytics } from '@vercel/analytics/vue';

const route = useRoute()
</script>
