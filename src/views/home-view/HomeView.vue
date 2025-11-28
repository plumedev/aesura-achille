<template>
  <UContainer class="min-h-screen py-8">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Tableau de dépenses -->
      <UCard>
        <template #header>
          <div class="space-y-4">
            <h2 class="text-xl font-semibold">{{ $t('home.title') }}</h2>
            <!-- Formulaire d'ajout -->
            <ExpenseForm ref="expenseFormRef" @add="handleAddExpense" :loading="isCreatingExpense" />
          </div>
        </template>

        <ExpenseTable :model-value="(expenses as Expense[]) || []" @update:model-value="handleUpdateExpenses"
          @delete="handleDeleteExpense" :loading="isLoadingExpenses" />
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ExpenseTable, { type Expense } from './components/ExpenseTable.vue'
import ExpenseForm from './components/ExpenseForm.vue'
import { useReadFireDoc } from '@/composables/firebase/useReadFireDoc'
import { useCreateFireDoc } from '@/composables/firebase/useCreateFireDoc'
import { useDeleteFireDoc } from '@/composables/firebase/useDeleteFireDoc'
import { useToast } from '@nuxt/ui/composables'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { add: addToast } = useToast()

const { data: expenses, doRequest: getExpenses, isLoading: isLoadingExpenses } = useReadFireDoc()
const { doRequest: createExpense, isLoading: isCreatingExpense } = useCreateFireDoc()
const { doRequest: deleteExpense } = useDeleteFireDoc()

interface ExpenseFormInstance {
  resetForm: () => void
}

const expenseFormRef = ref<ExpenseFormInstance | null>(null)

onMounted(async () => {
  await getExpenses({
    collectionName: 'transactions',
  })

  if (expenses.value && Array.isArray(expenses.value)) {
    expenses.value = expenses.value as Expense[]
  }
})

const handleAddExpense = async (expense: Expense) => {
  try {
    // Préparer les données à sauvegarder (sans l'ID généré localement)
    const expenseData = {
      name: expense.name,
      amount: expense.amount,
      account: expense.account,
      date: expense.date,
      type: expense.type
    }

    // Sauvegarder dans Firebase (sans toast automatique, on le gère nous-mêmes)
    await createExpense({
      collectionName: 'transactions',
      data: expenseData,
      showToast: false
    })

    // Recharger les dépenses depuis Firebase pour avoir les données à jour
    await getExpenses({
      collectionName: 'transactions',
    })

    if (expenses.value) {
      expenses.value = expenses.value
    }

    addToast({
      title: t('home.toast.add'),
      color: 'success',
      icon: 'i-lucide-circle-check'
    })

    if (expenseFormRef.value) {
      expenseFormRef.value.resetForm()
    }
  } catch (error) {
    console.error('Erreur lors de la création de la dépense:', error)
  }
}

const handleDeleteExpense = async (id: string) => {
  try {
    await deleteExpense({
      collectionName: 'transactions',
      documentId: id,
      showToast: false
    })

    await getExpenses({
      collectionName: 'transactions',
    })

    if (expenses.value) {
      expenses.value = expenses.value
    }

    addToast({
      title: t('home.toast.delete'),
      color: 'success',
      icon: 'i-lucide-circle-check'
    })
  } catch (error) {
    console.error('Erreur lors de la suppression de la dépense:', error)
  }
}

const handleUpdateExpenses = (newExpenses: Expense[]) => {
  expenses.value = newExpenses
}
</script>
