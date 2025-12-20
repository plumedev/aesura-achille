<template>
  <div class="flex flex-col space-y-6">
    <!-- 3 cartes en haut : Dépenses, Revenus, Solde -->
    <!-- Version mobile : une seule carte -->
    <UCard class="md:hidden">
      <div class="grid grid-cols-3 gap-4">
        <div class="flex flex-col space-y-2">
          <div class="text-xs font-medium text-gray-500 dark:text-gray-400">
            {{ $t('home.table.expenses') }}
          </div>
          <div class="text-lg font-bold text-red-400">
            {{ formattedTotalExpenses }}
          </div>
        </div>

        <div class="flex flex-col space-y-2">
          <div class="text-xs font-medium text-gray-500 dark:text-gray-400">
            {{ $t('home.table.income') }}
          </div>
          <div class="text-lg font-bold text-green-500">
            {{ formattedTotalIncome }}
          </div>
        </div>

        <div class="flex flex-col space-y-2">
          <div class="text-xs font-medium text-gray-500 dark:text-gray-400">
            {{ $t('home.table.balance') }}
          </div>
          <div :class="`text-lg font-bold ${balance >= 0 ? 'text-green-500' : 'text-red-400'}`">
            {{ formattedBalance }}
          </div>
        </div>
      </div>
    </UCard>

    <!-- Version desktop : 3 cartes séparées -->
    <div class="hidden md:grid grid-cols-3 gap-4">
      <UCard>
        <div class="flex flex-col space-y-2">
          <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
            {{ $t('home.table.expenses') }}
          </div>
          <div class="text-2xl font-bold text-red-400">
            {{ formattedTotalExpenses }}
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex flex-col space-y-2">
          <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
            {{ $t('home.table.income') }}
          </div>
          <div class="text-2xl font-bold text-green-500">
            {{ formattedTotalIncome }}
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex flex-col space-y-2">
          <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
            {{ $t('home.table.balance') }}
          </div>
          <div :class="`text-2xl font-bold ${balance >= 0 ? 'text-green-500' : 'text-red-400'}`">
            {{ formattedBalance }}
          </div>
        </div>
      </UCard>
    </div>

    <UCard>
      <template #default>
        <div v-if="loading" class="flex justify-center items-center py-12">
          <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-primary" />
        </div>

        <div v-else-if="modelValue.length === 0"
          class="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
          <UIcon name="i-lucide-inbox" class="w-12 h-12 mb-4" />
          <p>{{ $t('home.list.empty') }}</p>
        </div>

        <div v-else class="overflow-y-auto space-y-2" style="height: calc(100vh - 330px)">
          <TransactionItem v-for="expense in modelValue" :key="expense.id" :transaction="expense" :loading="loading"
            @delete="handleDeleteExpense" @update="handleUpdateExpense" />
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Expense } from './ExpenseTable.vue'
import { formatCurrency } from '@/helpers/NumberFormat.helper'
import TransactionItem from './children/TransactionItem.vue'

const props = defineProps<{
  modelValue: Expense[]
  loading: boolean
}>()

const emit = defineEmits<{
  delete: [id: string]
  update: [expense: Expense]
}>()

const totalExpenses = computed(() => {
  return props.modelValue
    .filter((expense) => expense.type === 'expense')
    .reduce((sum, expense) => sum + (expense.amount || 0), 0)
})

const totalIncome = computed(() => {
  return props.modelValue
    .filter((expense) => expense.type === 'income')
    .reduce((sum, expense) => sum + (expense.amount || 0), 0)
})

const balance = computed(() => {
  return totalIncome.value - totalExpenses.value
})

const formattedTotalExpenses = computed(() => {
  return formatCurrency(totalExpenses.value)
})

const formattedTotalIncome = computed(() => {
  return formatCurrency(totalIncome.value)
})

const formattedBalance = computed(() => {
  return formatCurrency(balance.value)
})

const handleDeleteExpense = (id: string) => {
  emit('delete', id)
}

const handleUpdateExpense = (expense: Expense) => {
  emit('update', expense)
}
</script>
