<template>
  <div class="flex flex-row w-full flex-wrap gap-0">
    <UPageCard v-for="card in uPageCardData"
      class="flex-1 w-full rounded-none first:rounded-l-lg last:rounded-r-lg hover:z-1" :key="card.title"
      :title="card.title" :icon="card.icon">
      <div class="flex items-center gap-2">
        <span class="text-lg md:text-2xl font-semibold" :class="'text-' + card.color">
          {{ card.value }}
        </span>
      </div>
    </UPageCard>
  </div>

</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ITransaction } from '@/interfaces/ITransaction'
import { TransactionsType } from '@/enums/TransactionsType.enum'
import { formatCurrency } from '@/helpers/NumberFormat.helper'
import { i18n } from '@/plugins/i18n'

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

const uPageCardData = computed(() => [{
  title: i18n.global.t('Transactions.summary.expenses'),
  value: formatCurrency(totalExpenses.value),
  icon: 'lucide-banknote-arrow-down',
  color: 'red-400',
}, {
  title: i18n.global.t('Transactions.summary.income'),
  value: formatCurrency(totalIncome.value),
  icon: 'lucide-banknote-arrow-up',
  color: 'green-400',
}, {
  title: i18n.global.t('Transactions.summary.balance'),
  value: formatCurrency(balance.value),
  icon: 'lucide-piggy-bank',
  color: balance.value >= 0 ? 'green-400' : 'red-400',
}])
</script>
