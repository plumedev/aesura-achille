<template>
  <UContainer class="min-h-screen py-8">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Carte principale -->
      <UCard>
        <template #header>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold">{{ $t('home.title') }}</h2>
              <!-- Switch entre tableau et liste -->
              <div class="flex items-center gap-3">
                <span class="text-sm font-medium">{{ $t('home.view.table') }}</span>
                <USwitch v-model="isListView" />
                <span class="text-sm font-medium">{{ $t('home.view.list') }}</span>
              </div>
            </div>
            <!-- Formulaire d'ajout avec accordion NuxtUI -->
            <UAccordion :items="accordionItems" class="w-full">
              <template #formContent>
                <ExpenseForm ref="expenseFormRef" @add="handleAddExpense" :loading="isCreatingExpense" />
              </template>
            </UAccordion>
          </div>
        </template>

        <template #default>
          <div class="space-y-4">
            <!-- Filtres -->
            <div class="flex flex-col md:flex-row items-start md:items-center gap-4">
              <!-- Filtre par type -->
              <div class="flex items-center gap-4">
                <label class="text-sm font-medium">{{ $t('home.filter.type') }}</label>
                <USelect v-model="selectedType" :items="typeFilterOptions" :placeholder="$t('home.filter.allTypes')"
                  class="w-48" clearable />
              </div>
              <!-- Filtre par compte -->
              <div class="flex items-center gap-4">
                <label class="text-sm font-medium">{{ $t('home.filter.account') }}</label>
                <USelect v-model="selectedAccount" :items="accountFilterOptions"
                  :placeholder="$t('home.filter.allAccounts')" class="w-48" clearable />
              </div>
            </div>

            <!-- Vue tableau -->
            <ExpenseTable v-if="viewMode === 'table'" :model-value="filteredExpenses"
              @update:model-value="handleUpdateExpenses" @delete="handleDeleteExpense" :loading="isLoadingExpenses" />

            <!-- Vue liste -->
            <ExpenseList v-else :model-value="filteredExpenses" @delete="handleDeleteExpense"
              :loading="isLoadingExpenses" />
          </div>
        </template>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import ExpenseTable, { type Expense } from './components/ExpenseTable.vue'
import ExpenseList from './components/ExpenseList.vue'
import ExpenseForm from './components/ExpenseForm.vue'
import { useReadFireDoc } from '@/composables/firebase/useReadFireDoc'
import { useCreateFireDoc } from '@/composables/firebase/useCreateFireDoc'
import { useDeleteFireDoc } from '@/composables/firebase/useDeleteFireDoc'
import { useToast } from '@nuxt/ui/composables'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { add: addToast } = useToast()

const { data: expenses, doRequest: getExpenses, isLoading: isLoadingExpenses } = useReadFireDoc()
const { data: accounts, doRequest: getAccounts } = useReadFireDoc()
const { doRequest: createExpense, isLoading: isCreatingExpense } = useCreateFireDoc()
const { doRequest: deleteExpense } = useDeleteFireDoc()

const selectedAccount = ref<string | undefined>(undefined)
const selectedType = ref<'expense' | 'income' | undefined>(undefined)
const isListView = ref<boolean>(true)

const viewMode = computed<'table' | 'list'>(() => {
  return isListView.value ? 'list' : 'table'
})

const accordionItems = computed(() => [
  {
    label: t('home.form.add'),
    icon: 'i-lucide-plus-circle',
    slot: 'formContent',
    defaultOpen: true
  }
])

const accountFilterOptions = computed(() => {
  const options: Array<{ label: string; value: string | undefined }> = [
    { label: t('home.filter.allAccounts'), value: undefined }
  ]

  if (accounts.value) {
    const accountOptions = accounts.value.map((account: any) => ({
      label: account.accountName,
      value: account.accountName as string
    }))
    options.push(...accountOptions)
  }

  return options
})

const typeFilterOptions = computed(() => [
  { label: t('home.filter.allTypes'), value: undefined },
  { label: t('home.form.expense'), value: 'expense' },
  { label: t('home.form.income'), value: 'income' }
])

const filteredExpenses = computed(() => {
  const allExpenses = (expenses.value as Expense[]) || []
  let filtered = allExpenses

  // Filtrer par type
  if (selectedType.value) {
    filtered = filtered.filter((expense) => expense.type === selectedType.value)
  }

  // Filtrer par compte
  if (selectedAccount.value) {
    filtered = filtered.filter((expense) => expense.account === selectedAccount.value)
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
      collectionName: 'transactions',
    }),
    getAccounts({
      collectionName: 'accounts',
    })
  ])

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
