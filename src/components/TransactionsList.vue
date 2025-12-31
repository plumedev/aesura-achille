<template>
  <div class="transactions-list flex flex-col space-y-4">
    <!-- Filtres -->
    <div class="flex flex-col md:flex-row items-start md:items-center gap-4">
      <div class="flex items-center gap-4">
        <label class="text-sm font-medium">Type</label>
        <USelect
          v-model="typeFilter"
          :items="typeFilterOptions"
          placeholder="Tous les types"
          class="w-48"
          clearable
        />
      </div>

      <div class="flex items-center gap-4">
        <label class="text-sm font-medium">Compte</label>
        <USelect
          v-model="accountFilter"
          :items="accountFilterOptions"
          placeholder="Tous les comptes"
          class="w-48"
        />
      </div>
    </div>

    <!-- Liste -->
    <UCard>
      <template #default>
        <div v-if="isLoadingTransactions" class="flex justify-center items-center py-12">
          <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-primary" />
        </div>

        <div
          v-else-if="filteredTransactions.length === 0"
          class="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400"
        >
          <UIcon name="i-lucide-inbox" class="w-12 h-12 mb-4" />
          <p>
            {{
              typeFilter !== undefined || accountFilter !== 'all'
                ? 'Aucune transaction ne correspond aux filtres sélectionnés.'
                : 'Commencez par créer votre première transaction.'
            }}
          </p>
        </div>

        <div v-else class="overflow-y-auto space-y-2" style="max-height: calc(100vh - 500px)">
          <TransactionCard
            v-for="transaction in filteredTransactions"
            :key="transaction.id"
            :transaction="transaction"
            @edit="handleEdit"
            @delete="handleDelete"
          />
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { ITransaction, TransactionType } from '@/interfaces/ITransaction'
import { useTransactions } from '@/composables/useTransactions'
import { useReadFireDoc } from '@/composables/firebase/useReadFireDoc'
import TransactionCard from './TransactionCard.vue'

const emit = defineEmits<{
  edit: [transaction: ITransaction]
}>()

const { transactions, deleteTransaction, isLoadingTransactions } = useTransactions()
const { data: accounts, doRequest: getAccounts } = useReadFireDoc()

const typeFilter = ref<TransactionType | undefined>(undefined)
const accountFilter = ref<string>('all')

const typeFilterOptions = computed(() => [
  { label: 'Tous les types', value: undefined },
  { label: 'Dépenses', value: 'expense' },
  { label: 'Revenus', value: 'income' }
])

const accountFilterOptions = computed(() => {
  const baseOptions = [{ label: 'Tous les comptes', value: 'all' }]
  if (accounts.value && Array.isArray(accounts.value)) {
    const accountNames = accounts.value.map((account: any) => ({
      label: account.accountName,
      value: account.accountName
    }))
    return [...baseOptions, ...accountNames]
  }
  return baseOptions
})

const filteredTransactions = computed(() => {
  let filtered = transactions.value

  // Filtrer par type
  if (typeFilter.value) {
    filtered = filtered.filter((t) => t.type === typeFilter.value)
  }

  // Filtrer par compte
  if (accountFilter.value && accountFilter.value !== 'all') {
    filtered = filtered.filter((t) => t.account === accountFilter.value)
  }

  return filtered
})

const handleEdit = (transaction: ITransaction) => {
  emit('edit', transaction)
}

const handleDelete = async (id: string) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
    await deleteTransaction(id)
  }
}

onMounted(async () => {
  await getAccounts({
    collectionName: 'accounts'
  })
})
</script>

<style scoped lang="scss">
.transactions-list {
  .list-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: rgb(250 250 250);
  }

  .filters {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      .filter-label {
        font-weight: 600;
        font-size: 0.9rem;
        color: rgb(250 250 250);
      }
    }
  }

  .transactions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 2rem;
    text-align: center;

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .empty-title {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      color: rgb(250 250 250);
    }

    .empty-message {
      font-size: 1rem;
      color: rgb(161 161 170);
      max-width: 400px;
    }
  }
}



@media (max-width: 640px) {
  .transactions-list {
    .transactions-grid {
      grid-template-columns: 1fr;
    }

    .filters {
      grid-template-columns: 1fr;
    }
  }
}
</style>
