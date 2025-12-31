<template>
  <UContainer class="py-4 flex flex-col space-y-6">
    <!-- Stats - Version mobile : une seule carte -->
    <UCard class="md:hidden">
      <div class="grid grid-cols-3 gap-4">
        <div class="flex flex-col space-y-2">
          <div class="text-xs font-medium text-gray-500 dark:text-gray-400">Dépenses</div>
          <div class="text-lg font-bold text-red-400">{{ formattedTotalExpense }}</div>
        </div>

        <div class="flex flex-col space-y-2">
          <div class="text-xs font-medium text-gray-500 dark:text-gray-400">Revenus</div>
          <div class="text-lg font-bold text-green-500">{{ formattedTotalIncome }}</div>
        </div>

        <div class="flex flex-col space-y-2">
          <div class="text-xs font-medium text-gray-500 dark:text-gray-400">Solde</div>
          <div :class="`text-lg font-bold ${balance >= 0 ? 'text-green-500' : 'text-red-400'}`">
            {{ formattedBalance }}
          </div>
        </div>
      </div>
    </UCard>

    <!-- Stats - Version desktop : 3 cartes séparées -->
    <div class="hidden md:grid grid-cols-3 gap-4">
      <UCard>
        <div class="flex flex-col space-y-2">
          <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Dépenses</div>
          <div class="text-2xl font-bold text-red-400">{{ formattedTotalExpense }}</div>
        </div>
      </UCard>

      <UCard>
        <div class="flex flex-col space-y-2">
          <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Revenus</div>
          <div class="text-2xl font-bold text-green-500">{{ formattedTotalIncome }}</div>
        </div>
      </UCard>

      <UCard>
        <div class="flex flex-col space-y-2">
          <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Solde</div>
          <div :class="`text-2xl font-bold ${balance >= 0 ? 'text-green-500' : 'text-red-400'}`">
            {{ formattedBalance }}
          </div>
        </div>
      </UCard>
    </div>

    <!-- Formulaire de création -->
    <div class="form-section">
      <TransactionForm />
    </div>

    <!-- Liste des transactions -->
    <div class="list-section">
      <TransactionsList />
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useTransactions } from '@/composables/useTransactions'
import { formatCurrency } from '@/helpers/NumberFormat.helper'
import TransactionForm from '@/components/TransactionForm.vue'
import TransactionsList from '@/components/TransactionsList.vue'

const { transactions, initializeTransactions } = useTransactions()

const totalIncome = computed(() => {
  return transactions.value
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
})

const totalExpense = computed(() => {
  return transactions.value
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
})

const balance = computed(() => {
  return totalIncome.value - totalExpense.value
})

const formattedTotalExpense = computed(() => {
  return formatCurrency(totalExpense.value)
})

const formattedTotalIncome = computed(() => {
  return formatCurrency(totalIncome.value)
})

const formattedBalance = computed(() => {
  return formatCurrency(balance.value)
})

onMounted(async () => {
  await initializeTransactions()
})
</script>

<style scoped lang="scss"></style>
