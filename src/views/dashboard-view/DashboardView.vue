<template>
  <Teleport to="#dashboard-toolbar-left" v-if="isMounted">
    <MonthNavigation />
    <FilterTransactions class="hidden md:flex" :transactions="transactionsList" v-model:selectedType="selectedType"
      v-model:selectedAccounts="selectedAccounts" />
  </Teleport>

  <TransactionsSummary :transactions="filteredExpenses" />
  <TransactionsList :transactions="filteredExpenses" />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useReadFireDoc } from '@/composables/firebase/useReadFireDoc'
import type { ITransaction } from '@/interfaces/ITransaction';
import TransactionsSummary from '@/views/my-month-view/components/TransactionsSummary.vue';
import MonthNavigation from '@/components/MonthNavigation.vue';
import TransactionsList from '@/components/TransactionsList.vue';
import FilterTransactions from '@/views/my-month-view/components/FilterTransactions.vue';

const { data: transactions, doRequest: getTransactions } = useReadFireDoc()

const selectedAccounts = ref<string[]>([])
const selectedType = ref<'expense' | 'income' | undefined>(undefined)
const isMounted = ref(false)

const transactionsList = computed(() => {
  const data = transactions.value
  return Array.isArray(data) ? (data as ITransaction[]) : null
})

const filteredExpenses = computed(() => {
  const allExpenses = (transactionsList.value as ITransaction[]) || []
  let filtered = allExpenses

  // Filtrer par type
  if (selectedType.value) {
    filtered = filtered.filter((transaction) => transaction.type === selectedType.value)
  }

  // Filtrer par compte (multi-sélection)
  if (selectedAccounts.value.length > 0) {
    filtered = filtered.filter((transaction) => selectedAccounts.value.includes(transaction.account as string))
  }

  return filtered
})

onMounted(async () => {
  isMounted.value = true
  await getTransactions({
    collectionName: 'transactions'
  })
})

</script>
