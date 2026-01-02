<template>
  <UApp>
    <Analytics />
    <StyleProvider>
      <ModalProvider />
      <div class="min-h-screen bg-default">
        <Header />
        <RouterView />
      </div>
    </StyleProvider>
  </UApp>
</template>

<script lang="ts" setup>
import StyleProvider from './providers/StyleProvider.vue'
import ModalProvider from './providers/ModalProvider.vue'
import Header from './components/Header.vue'
import { Analytics } from '@vercel/analytics/vue';
</script>
