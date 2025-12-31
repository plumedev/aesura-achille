import { ref, computed } from 'vue'
import type { ITransaction, Account, Periodicity, TransactionType } from '@/interfaces/ITransaction'
import { addMonths, addQuarters, addYears, format } from 'date-fns'
import { useCreateFireDoc } from '@/composables/firebase/useCreateFireDoc'
import { useReadFireDoc } from '@/composables/firebase/useReadFireDoc'
import { useUpdateFireDoc } from '@/composables/firebase/useUpdateFireDoc'
import { useDeleteFireDoc } from '@/composables/firebase/useDeleteFireDoc'

const transactions = ref<ITransaction[]>([])
const isInitialized = ref(false)

export function useTransactions() {
  const { data, doRequest: getTransactions, isLoading: isLoadingTransactions } = useReadFireDoc()
  const { doRequest: createTransaction, isLoading: isCreating } = useCreateFireDoc()
  const { doRequest: updateTransactionDoc } = useUpdateFireDoc()
  const { doRequest: deleteTransactionDoc } = useDeleteFireDoc()

  // Initialiser les transactions depuis Firebase
  const initializeTransactions = async () => {
    if (!isInitialized.value) {
      await getTransactions({
        collectionName: 'recurring_transactions'
      })
      
      if (data.value && Array.isArray(data.value)) {
        transactions.value = data.value as ITransaction[]
      }
      isInitialized.value = true
    }
  }

  const addTransaction = async (transaction: Omit<ITransaction, 'id'>) => {
    const transactionData = {
      name: transaction.name,
      amount: transaction.amount,
      account: transaction.account,
      creationDate: transaction.creationDate,
      effectDate: transaction.effectDate,
      effectEndDate: transaction.effectEndDate,
      periodicity: transaction.periodicity,
      type: transaction.type
    }

    await createTransaction({
      collectionName: 'recurring_transactions',
      data: transactionData,
      showToast: false
    })

    await getTransactions({
      collectionName: 'recurring_transactions'
    })

    if (data.value && Array.isArray(data.value)) {
      transactions.value = data.value as ITransaction[]
    }
  }

  const updateTransaction = async (id: string, updatedTransaction: Partial<ITransaction>) => {
    const transactionData = {
      name: updatedTransaction.name,
      amount: updatedTransaction.amount,
      account: updatedTransaction.account,
      effectDate: updatedTransaction.effectDate,
      effectEndDate: updatedTransaction.effectEndDate,
      periodicity: updatedTransaction.periodicity,
      type: updatedTransaction.type
    }

    await updateTransactionDoc({
      collectionName: 'recurring_transactions',
      documentId: id,
      data: transactionData,
      showToast: false
    })

    await getTransactions({
      collectionName: 'recurring_transactions'
    })

    if (data.value && Array.isArray(data.value)) {
      transactions.value = data.value as ITransaction[]
    }
  }

  const deleteTransaction = async (id: string) => {
    await deleteTransactionDoc({
      collectionName: 'recurring_transactions',
      documentId: id,
      showToast: false
    })

    await getTransactions({
      collectionName: 'recurring_transactions'
    })

    if (data.value && Array.isArray(data.value)) {
      transactions.value = data.value as ITransaction[]
    }
  }

  const getFilteredTransactions = (
    typeFilter?: TransactionType | 'all',
    accountFilter?: Account | 'all'
  ) => {
    return computed(() => {
      return transactions.value.filter((transaction) => {
        const matchesType = !typeFilter || typeFilter === 'all' || transaction.type === typeFilter
        const matchesAccount =
          !accountFilter || accountFilter === 'all' || transaction.account === accountFilter
        return matchesType && matchesAccount
      })
    })
  }

  const calculateEndDate = (startDate: Date, periodicity: Periodicity): Date => {
    switch (periodicity) {
      case 'mensuelle':
        return addMonths(startDate, 1)
      case 'trimestrielle':
        return addQuarters(startDate, 1)
      case 'annuelle':
        return addYears(startDate, 1)
      case 'unique':
        return startDate
      default:
        return startDate
    }
  }

  const formatDateForInput = (date: Date): string => {
    return format(date, 'yyyy-MM-dd')
  }

  return {
    transactions: computed(() => transactions.value),
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getFilteredTransactions,
    calculateEndDate,
    formatDateForInput,
    initializeTransactions,
    isLoadingTransactions,
    isCreating
  }
}
