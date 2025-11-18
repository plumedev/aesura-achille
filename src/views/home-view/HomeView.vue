<template>
  <UContainer class="min-h-screen py-8">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Tableau de dépenses -->
      <UCard>
        <template #header>
          <div class="space-y-4">
            <h2 class="text-xl font-semibold">{{ $t('home.title') }}</h2>
            <!-- Formulaire d'ajout -->
            <ExpenseForm @add="handleAddExpense" />
          </div>
        </template>

        <ExpenseTable v-model="expenses as Expense[]" />
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ExpenseTable, { type Expense } from './components/ExpenseTable.vue'
import ExpenseForm from './components/ExpenseForm.vue'
import { useReadFireDoc } from '@/composables/firebase/useReadFireDoc'

const { data: expenses, doRequest: getExpenses } = useReadFireDoc()

onMounted(async () => {
  await getExpenses({
    collectionName: 'transactions',
  })

  if (expenses.value && Array.isArray(expenses.value)) {
    expenses.value = expenses.value as Expense[]
  }
})

const handleAddExpense = (expense: Expense) => {
  expenses.value?.unshift(expense)
}
</script>
