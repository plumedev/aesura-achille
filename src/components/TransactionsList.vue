<template>
  <div v-if="transactions && transactions.length > 0">
    <div v-for="transaction in transactions" :key="transaction.id"
      class="flex items-center justify-between min-h-[80px] mb-4 bg-neutral-800 rounded">

      <span class="w-[4px] bg-red-400 h-[80px] block rounded-l"></span>

      <UIcon :name="defineIcon(transaction.type)" :class="defineColor(transaction.type)" class="w-6 h-6 mx-4" />

      <div class="p-4 pl-0 w-full flex items-center justify-between">
        <div class="flex flex-col">
          <div class="font-semibold dark:text-gray-100"> {{ transaction.name }}</div>
          <div class="flex items-center gap-2">
            <UBadge color="primary" variant="soft" size="sm" class="w-fit">
              {{ transaction.account }}
            </UBadge>
            <span class="text-sm text-gray-500 dark:text-gray-400">{{ transaction.effectDate }}</span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <div :class="`text-lg font-bold ${defineColor(transaction.type)}`">
            {{ transaction.type === 'income' ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
          </div>
          <UDropdownMenu :items="getTransactionActions(transaction.id, transaction)">
            <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" aria-label="Actions dropdown" />
          </UDropdownMenu>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ITransaction } from '@/interfaces/ITransaction'
import { formatCurrency } from '@/helpers/NumberFormat.helper'

defineProps<{
  transactions: ITransaction[] | null | undefined
}>()

const emit = defineEmits<{
  deleteTransaction: [id: string]
  editTransaction: [transaction: ITransaction]
}>()

const defineIcon = (type: string) => {
  switch (type) {
    case 'income':
      return 'i-lucide-banknote-arrow-up'
    case 'expense':
      return 'i-lucide-banknote-arrow-down'
  }
}

const defineColor = (type: string) => {
  switch (type) {
    case 'income':
      return 'text-green-400'
    case 'expense':
      return 'text-red-400'
  }
}

const getTransactionActions = (transactionId: string, transaction: ITransaction) => [
  {
    label: 'Delete',
    icon: 'i-lucide-trash-2',
    onSelect: () => {
      emit('deleteTransaction', transactionId)
    }
  },
  {
    label: 'Edit',
    icon: 'i-lucide-edit',
    onSelect() {
      emit('editTransaction', transaction)
    }
  }
]
</script>
