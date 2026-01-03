<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-900">
    <UContainer class="text-center">
      <div class="max-w-md mx-auto space-y-6">
        <div class="space-y-2">
          <h1 class="text-9xl font-bold text-gray-200 dark:text-primary-400">404</h1>
          <h2 class="text-3xl font-semibold text-gray-900 dark:text-white">
            Page introuvable
          </h2>
          <p class="text-gray-600 dark:text-gray-400">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UButton color="primary" size="lg" @click="goHome" trailing-icon="i-lucide-home">
            Retour à l'accueil
          </UButton>
          <UButton variant="outline" color="gray" size="lg" @click="goBack" trailing-icon="i-lucide-arrow-left">
            Retour en arrière
          </UButton>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}
</script>
