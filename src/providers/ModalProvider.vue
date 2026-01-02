<template>
  <UModal v-model:open="isOpen" :id="modalId" class="max-w-4xl">
    <template #content>
      <h3 v-if="modalState.title" class="p-4 text-lg font-bold">{{ modalState.title }}</h3>
      <component v-if="modalState.component" :is="modalState.component" v-bind="modalState.props"
        v-on="modalState.events || {}" class="p-4" />
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { useModal } from '@/composables/utils/useModal'
import { resolveComponent, computed } from 'vue'

const UModal = resolveComponent('UModal')

const { modalState, closeModal } = useModal()

const modalId = 'global-modal'

const isOpen = computed({
  get: () => modalState.value.isOpen,
  set: (value: boolean) => {
    if (!value) {
      closeModal()
    }
  }
})
</script>
