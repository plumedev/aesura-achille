<template>
  <UHeader title="Aesura">
    <template #right>
      <div class="flex items-center gap-2">
        <span v-if="userEmail" class="text-sm text-gray-600 dark:text-gray-400">
          {{ userEmail }}
        </span>
        <UButton v-if="authStore.isAuthenticated" variant="ghost" color="gray" size="sm" @click="handleSignOut">
          Déconnexion
        </UButton>
        <UColorModeButton />
      </div>
    </template>
  </UHeader>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useAuth } from '@/composables/firebase/useAuth'

const router = useRouter()
const authStore = useAuthStore()
const { signOut } = useAuth()

const userEmail = computed(() => authStore.user?.email ?? '')

const handleSignOut = async () => {
  try {
    await signOut()
    router.push('/login')
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
  }
}
</script>
