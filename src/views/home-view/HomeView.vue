<template>
  <UContainer id="home-container" class="py-4" height="calc(100vh - 100px)">
    <!-- Carte principale -->

    <div class="space-y-4">
      <ExpenseForm class="hidden md:block" ref="expenseFormRef" @add="handleAddExpense" :loading="isCreatingExpense" />
    </div>

    <div class="space-y-4">
      <!-- Filtres -->
      <div class="flex flex-col justify-between md:flex-row items-start md:items-center hidden md:flex gap-4 my-4">
        <!-- Filtre par type -->
        <div class="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div class="flex items-center gap-4">
            <label class="text-sm font-medium">{{ $t('home.filter.type') }}</label>
            <USelect
              v-model="selectedType"
              :items="typeFilterOptions"
              :placeholder="$t('home.filter.allTypes')"
              class="w-48"
              clearable
            />
          </div>
          <!-- Filtre par compte -->
          <div class="flex items-center gap-4">
            <label class="text-sm font-medium">{{ $t('home.filter.account') }}</label>
            <USelect
              v-model="selectedAccount"
              :items="accountFilterOptions"
              :placeholder="$t('home.filter.allAccounts')"
              class="w-48"
              clearable
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <!-- Switch entre tableau et liste -->
          <div class="flex items-center gap-3">
            <span class="text-sm font-medium">{{ $t('home.view.table') }}</span>
            <USwitch v-model="isListView" />
            <span class="text-sm font-medium">{{ $t('home.view.list') }}</span>
          </div>
        </div>
      </div>

      <!-- Vue tableau -->
      <ExpenseTable
        v-if="viewMode === 'table'"
        :model-value="filteredExpenses"
        @update:model-value="handleUpdateExpenses"
        @delete="handleDeleteExpense"
        :loading="isLoadingExpenses"
      />

      <!-- Vue liste -->
      <ExpenseList v-else :model-value="filteredExpenses" @delete="handleDeleteExpense" :loading="isLoadingExpenses" />
    </div>
  </UContainer>

  <NavbarFixed class="md:hidden bg-dark-500">
    <template #content>
      <div class="flex justify-between">
        <div>
          <UModal id="add-transaction-modal">
            <UButton icon="i-lucide-plus" :label="$t('home.form.addTransaction')" color="primary" variant="solid" />

            <template #content>
              <h3 class="p-4 text-lg font-bold">{{ $t('home.form.add') }}</h3>
              <ExpenseForm ref="expenseFormRef" @add="handleAddExpense" :loading="isCreatingExpense" />
            </template>
          </UModal>

          <UModal id="filter-modal" class="mx-2">
            <UButton icon="i-lucide-filter" :label="$t('home.form.filters')" color="neutral" variant="solid" />

            <template #content>
              <div class="flex flex-col justify-between md:flex-row items-start md:items-center gap-4 p-4">
                <!-- Filtre par type -->
                <div class="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <div class="flex items-center gap-4">
                    <label class="text-sm font-medium">{{ $t('home.filter.type') }}</label>
                    <USelect
                      v-model="selectedType"
                      :items="typeFilterOptions"
                      :placeholder="$t('home.filter.allTypes')"
                      class="w-48"
                      clearable
                    />
                  </div>
                  <!-- Filtre par compte -->
                  <div class="flex items-center gap-4">
                    <label class="text-sm font-medium">{{ $t('home.filter.account') }}</label>
                    <USelect
                      v-model="selectedAccount"
                      :items="accountFilterOptions"
                      :placeholder="$t('home.filter.allAccounts')"
                      class="w-48"
                      clearable
                    />
                  </div>
                </div>
              </div>
            </template>
          </UModal>
        </div>

        <div class="flex items-center justify-between">
          <!-- Switch entre tableau et liste -->
          <div class="flex items-center gap-3">
            <span class="text-sm font-medium"><UIcon name="i-lucide-table" class="size-5" /></span>
            <USwitch v-model="isListView" />
            <span class="text-sm font-medium"><UIcon name="i-lucide-list" class="size-5" /></span>
          </div>
        </div>
      </div>
    </template>
  </NavbarFixed>
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
import NavbarFixed from '@/components/NavbarFixed.vue'

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
      collectionName: 'transactions'
    }),
    getAccounts({
      collectionName: 'accounts'
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

const handleUpdateExpenses = (newExpenses: Expense[]) => {
  expenses.value = newExpenses
}
</script>
