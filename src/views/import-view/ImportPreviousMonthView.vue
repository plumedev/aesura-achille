<template>
    <UContainer class="py-4">
        <div class="flex flex-col gap-4">
            <div class="flex items-center justify-between">
                <h1 class="text-2xl font-bold">{{ $t('home.modal.importPreviousMonth.title') }}</h1>
                <div class="flex gap-2">
                    <UButton :label="$t('home.modal.importPreviousMonth.actions.cancel')" color="gray" variant="ghost"
                        to="/" />
                    <UButton :label="$t('home.modal.importPreviousMonth.actions.import')" color="primary"
                        variant="solid" @click="handleImportTransactions" :loading="isImporting" />
                </div>
            </div>

            <UCard>
                <template #header>
                    <div class="flex gap-2">
                        <UButton
                            :label="areAllSelected ? $t('home.modal.importPreviousMonth.actions.unselectAll') : $t('home.modal.importPreviousMonth.actions.selectAll')"
                            :icon="areAllSelected ? 'i-lucide-square' : 'i-lucide-check-square'" color="primary"
                            variant="solid" @click="toggleSelection" />
                    </div>
                </template>

                <UScrollArea class="h-[calc(100vh-250px)]">
                    <div class="space-y-2 p-4">
                        <div v-if="isLoadingPreviousMonthTransactions" class="grid gap-2">
                            <USkeleton class="h-4 w-[250px]" />
                            <USkeleton class="h-4 w-[200px]" />
                        </div>
                        <TransactionItem v-else v-for="item in previousMonthTransactions" :key="item.id"
                            :transaction="item" selectable :selected="selectedTransactionIds.has(item.id)" allow-actions
                            @select="handleSelect" @update="handleUpdatePreviousMonthTransaction" />

                        <div v-if="previousMonthTransactions.length === 0 && !isLoadingPreviousMonthTransactions"
                            class="text-center text-gray-500 py-8">
                            {{ $t('home.modal.importPreviousMonth.noTransactions') ||
                                'Aucune transaction trouvée pour le mois précédent.' }}
                        </div>
                    </div>
                </UScrollArea>
            </UCard>
        </div>
    </UContainer>
</template>


<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useToast } from '@nuxt/ui/composables'
import type { IExpense } from '@/interfaces/IExpense'
import { getCurrentMonth, projectDateToMonth } from '@/helpers/DateFormat.helper'
import { useReadTransactionsByMonth } from '@/composables/firebase/useReadTransactionsByMonth'
import { useCreateFireDoc } from '@/composables/firebase/useCreateFireDoc'

import TransactionItem from '../home-view/components/children/TransactionItem.vue'

const { t } = useI18n()
const router = useRouter()
const { add: addToast } = useToast()

// Composables
const { doRequest: getPreviousMonthTransactions, isLoading: isLoadingPreviousMonthTransactions } = useReadTransactionsByMonth()
const { doRequest: createExpense } = useCreateFireDoc()


// State
const previousMonthTransactions = ref<IExpense[]>([])
const selectedTransactionIds = ref(new Set<string>())
const isImporting = ref(false)

// Computed
const areAllSelected = computed(() => {
    return previousMonthTransactions.value.length > 0 &&
        selectedTransactionIds.value.size === previousMonthTransactions.value.length
})

// Init
onMounted(async () => {
    const currentMonth = getCurrentMonth()
    previousMonthTransactions.value = await getPreviousMonthTransactions({
        collectionName: 'transactions',
        year: currentMonth.year,
        month: currentMonth.month - 1
    })
})

// Actions
const handleSelect = (id: string, selected: boolean) => {
    if (selected) {
        selectedTransactionIds.value.add(id)
    } else {
        selectedTransactionIds.value.delete(id)
    }
}

const handleSelectAll = () => {
    previousMonthTransactions.value.forEach((t) => selectedTransactionIds.value.add(t.id))
}

const handleUnselectAll = () => {
    selectedTransactionIds.value.clear()
}

const toggleSelection = () => {
    if (areAllSelected.value) {
        handleUnselectAll()
    } else {
        handleSelectAll()
    }
}

const handleUpdatePreviousMonthTransaction = (updatedTransaction: IExpense) => {
    const index = previousMonthTransactions.value.findIndex(t => t.id === updatedTransaction.id)
    if (index !== -1) {
        previousMonthTransactions.value[index] = updatedTransaction
        addToast({
            title: 'Transaction mise à jour',
            color: 'success',
            icon: 'i-lucide-circle-check'
        })
    }
}

const handleImportTransactions = async () => {
    if (selectedTransactionIds.value.size === 0) {
        addToast({
            title: t('home.modal.importPreviousMonth.toast.noSelection'),
            color: 'warning',
            icon: 'i-lucide-alert-circle'
        })
        return
    }

    isImporting.value = true
    const transactionsToImport = previousMonthTransactions.value.filter(t => selectedTransactionIds.value.has(t.id))
    let importedCount = 0
    const currentMonth = getCurrentMonth()

    try {
        for (const transaction of transactionsToImport) {
            // Projeter la date vers le mois actuel
            const newDate = projectDateToMonth(
                transaction.date,
                currentMonth.year,
                currentMonth.month
            )

            const newExpense = {
                name: transaction.name,
                amount: transaction.amount,
                account: transaction.account,
                date: newDate,
                type: transaction.type
            }

            await createExpense({
                collectionName: 'transactions',
                data: newExpense,
                showToast: false
            })

            importedCount++
        }

        if (importedCount > 0) {
            addToast({
                title: t('home.modal.importPreviousMonth.toast.success', { count: importedCount }),
                color: 'success',
                icon: 'i-lucide-check-circle'
            })

            // Redirection vers l'accueil
            router.push('/')
        }
    } catch (error) {
        console.error('Erreur import:', error)
        addToast({
            title: 'Erreur lors de l\'import',
            color: 'error',
            icon: 'i-lucide-alert-triangle'
        })
    } finally {
        isImporting.value = false
    }
}
</script>
