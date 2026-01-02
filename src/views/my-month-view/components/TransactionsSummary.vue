<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <!-- Carte Dépenses -->
    <UCard>
      <div class="flex flex-col space-y-2">
        <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
          {{ $t('Transactions.summary.expenses') }}
        </div>
        <div class="text-2xl font-bold text-red-400">
          {{ formattedTotalExpenses }}
        </div>
      </div>
    </UCard>

    <!-- Carte Revenus -->
    <UCard>
      <div class="flex flex-col space-y-2">
        <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
          {{ $t('Transactions.summary.income') }}
        </div>
        <div class="text-2xl font-bold text-green-500">
          {{ formattedTotalIncome }}
        </div>
      </div>
    </UCard>

    <!-- Carte Balance -->
    <UCard>
      <div class="flex flex-col space-y-2">
        <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
          {{ $t('Transactions.summary.balance') }}
        </div>
        <div :class="`text-2xl font-bold ${balance >= 0 ? 'text-green-500' : 'text-red-400'}`">
          {{ formattedBalance }}
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ITransaction } from '@/interfaces/ITransaction'
import { TransactionsType } from '@/enums/TransactionsType.enum'
import { formatCurrency } from '@/helpers/NumberFormat.helper'

const props = defineProps<{
  transactions: ITransaction[] | null | undefined
}>()

const totalExpenses = computed(() => {
  if (!props.transactions || props.transactions.length === 0) return 0
  return props.transactions
    .filter(transaction => transaction.type === TransactionsType.EXPENSE || transaction.type === 'expense')
    .reduce((sum, transaction) => {
      const amount = Number(transaction.amount) || 0
      return sum + amount
    }, 0)
})

const totalIncome = computed(() => {
  if (!props.transactions || props.transactions.length === 0) return 0
  return props.transactions
    .filter(transaction => transaction.type === TransactionsType.INCOME || transaction.type === 'income')
    .reduce((sum, transaction) => {
      const amount = Number(transaction.amount) || 0
      return sum + amount
    }, 0)
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
</script>
