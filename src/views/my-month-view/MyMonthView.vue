<template>
  <div class="flex flex-col gap-4">

    <UContainer class="mt-4">
      <UCard class="bg-muted/50">
        <TransactionsForm class="min-h-[224px]" @createTransaction="handleCreateTransaction"
          :transactionToEdit="transactionData" />
      </UCard>
    </UContainer>

    <UContainer class="mt-4">
      <TransactionsSummary :transactions="transactionsList" />
    </UContainer>

    <UContainer>
      <TransactionsList class="h-[calc(100vh-400px)] overflow-y-scroll" :transactions="transactionsList"
        @deleteTransaction="handleDeleteTransaction" @editTransaction="handleEditTransaction" />
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import TransactionsForm from '@/components/TransactionsForm.vue'
import TransactionsList from '@/components/TransactionsList.vue'
import TransactionsSummary from './components/TransactionsSummary.vue'
import { useDeleteFireDoc } from '@/composables/firebase/useDeleteFireDoc'
import { useReadFireDoc } from '@/composables/firebase/useReadFireDoc'
import { useModal } from '@/composables/utils/useModal'
import type { ITransaction } from '@/interfaces/ITransaction'
import type { DocumentData } from 'firebase/firestore'
import { computed, onMounted, ref } from 'vue'

const { data: transactions, doRequest: getTransactions } = useReadFireDoc()
const { doRequest: deleteTransaction } = useDeleteFireDoc()
const { openModal, closeModal } = useModal()


let transactionData = ref<DocumentData | DocumentData[] | null>(null)

const transactionsList = computed(() => {
  const data = transactions.value
  return Array.isArray(data) ? (data as ITransaction[]) : null
})

const handleCreateTransaction = () => {
  getTransactions({
    collectionName: 'transactions'
  })
}

const handleDeleteTransaction = async (id: string) => {
  await deleteTransaction({
    collectionName: 'transactions',
    documentId: id
  })
  await getTransactions({
    collectionName: 'transactions'
  })
}

const handleEditTransaction = async (transaction: ITransaction) => {
  openModal(
    TransactionsForm,
    {
      formToEdit: transaction
    },
    {
      createTransaction: () => {
        getTransactions({
          collectionName: 'transactions'
        })
        closeModal()
      }
    },
    'Modifier la transaction'
  )
}

onMounted(async () => {
  await getTransactions({
    collectionName: 'transactions'
  })
})
</script>
