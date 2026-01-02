<template>
  <UContainer id="home-container" class="py-4" height="calc(100vh - 100px)">

    <div class="space-y-4">
      <ExpenseForm class="hidden md:block" ref="expenseFormRef" @add="handleAddExpense" :loading="isCreatingExpense" />
    </div>

    <div class="space-y-4">

      <div class="flex justify-center my-4">
        <MonthNavigation v-model:monthYear="selectedMonthYear" />
      </div>

      <FilterTransactions class="hidden md:flex" :accountsOptions="accountsList" v-model:selectedType="selectedType"
        v-model:selectedAccounts="selectedAccounts" v-model:isListView="isListView" />

      <ExpenseTable v-if="viewMode === 'table'" :model-value="filteredExpenses"
        @update:model-value="handleUpdateExpenses" @delete="handleDeleteExpense" :loading="isLoadingExpenses" />

      <ExpenseList v-else :model-value="filteredExpenses" @delete="handleDeleteExpense" @update="handleUpdateExpense"
        :loading="isLoadingExpenses" />
    </div>
  </UContainer>

  <MobileNavbar :accountsOptions="accountsList" v-model:selectedType="selectedType"
    v-model:selectedAccounts="selectedAccounts" v-model:isListView="isListView" @add="handleAddExpense"
    :isCreatingExpense="isCreatingExpense" />
  {{ }}
</template>

<script setup lang="ts">
import { useCreateFireDoc } from '@/composables/firebase/useCreateFireDoc'
import { useDeleteFireDoc } from '@/composables/firebase/useDeleteFireDoc'
import { useReadFireDoc } from '@/composables/firebase/useReadFireDoc'
import { useUpdateFireDoc } from '@/composables/firebase/useUpdateFireDoc'
import { getCurrentMonth, isDateInMonth, type MonthYear } from '@/helpers/DateFormat.helper'
import type { IExpense } from '@/interfaces/IExpense'
import { useToast } from '@nuxt/ui/composables'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ExpenseForm from './components/ExpenseForm.vue'
import ExpenseList from './components/ExpenseList.vue'
import ExpenseTable from './components/ExpenseTable.vue'
import FilterTransactions from './components/children/FilterTransactions.vue'
import MonthNavigation from './components/children/MonthNavigation.vue'
import MobileNavbar from './components/MobileNavbar.vue'

const { t } = useI18n()
const { add: addToast } = useToast()

const { data: expenses, doRequest: getExpenses, isLoading: isLoadingExpenses } = useReadFireDoc()
const { data: accounts, doRequest: getAccounts } = useReadFireDoc()
const { doRequest: createExpense, isLoading: isCreatingExpense } = useCreateFireDoc()
const { doRequest: deleteExpense } = useDeleteFireDoc()
const { doRequest: updateExpense } = useUpdateFireDoc()

const selectedMonthYear = ref<MonthYear>(getCurrentMonth())

const selectedAccounts = ref<string[]>([])
const selectedType = ref<'expense' | 'income' | undefined>(undefined)
const isListView = ref<boolean>(true)
const viewMode = computed<'table' | 'list'>(() => {
  return isListView.value ? 'list' : 'table'
})

const accountsList = computed(() => {
  return (Array.isArray(accounts.value) ? accounts.value : [])
})

const filteredExpenses = computed(() => {
  const allExpenses = (expenses.value as IExpense[]) || []
  let filtered = allExpenses

  // Filtrer par mois/année sélectionné
  filtered = filtered.filter((expense) =>
    isDateInMonth(expense.date, selectedMonthYear.value.year, selectedMonthYear.value.month)
  )

  // Filtrer par type
  if (selectedType.value) {
    filtered = filtered.filter((expense) => expense.type === selectedType.value)
  }

  // Filtrer par compte (multi-sélection)
  if (selectedAccounts.value.length > 0) {
    filtered = filtered.filter((expense) => selectedAccounts.value.includes(expense.account as string))
  }

  return filtered
})

interface ExpenseFormInstance {
  resetForm: () => void
}

const expenseFormRef = ref<ExpenseFormInstance | null>(null)

onMounted(async () => {
  await Promise.all([
    getExpenses({
      collectionName: 'transactions'
    }),
    getAccounts({
      collectionName: 'accounts'
    })
  ])

  if (expenses.value && Array.isArray(expenses.value)) {
    expenses.value = expenses.value as IExpense[]
  }
})

const handleAddExpense = async (expense: IExpense) => {
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
      collectionName: 'transactions'
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
      collectionName: 'transactions'
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

const handleUpdateExpenses = (newExpenses: IExpense[]) => {
  expenses.value = newExpenses
}

const handleUpdateExpense = async (expense: IExpense) => {
  try {
    // Préparer les données à mettre à jour (sans l'ID)
    const expenseData = {
      name: expense.name,
      amount: expense.amount,
      account: expense.account,
      date: expense.date,
      type: expense.type
    }

    // Mettre à jour dans Firebase (sans toast automatique, on le gère nous-mêmes)
    await updateExpense({
      collectionName: 'transactions',
      documentId: expense.id,
      data: expenseData,
      showToast: false
    })

    // Recharger les dépenses depuis Firebase pour avoir les données à jour
    await getExpenses({
      collectionName: 'transactions'
    })

    if (expenses.value) {
      expenses.value = expenses.value
    }

    addToast({
      title: t('home.toast.update'),
      color: 'success',
      icon: 'i-lucide-circle-check'
    })
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la dépense:', error)
  }
}



</script>
