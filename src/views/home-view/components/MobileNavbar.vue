<template>
    <NavbarFixed class="md:hidden bg-dark-500">
        <template #content>
            <div class="flex justify-between">
                <div>
                    <UModal id="add-transaction-modal">
                        <UButton icon="i-lucide-plus" :label="$t('home.form.addTransaction')" color="primary"
                            variant="solid" />

                        <template #content>
                            <h3 class="p-4 text-lg font-bold">{{ $t('home.form.add') }}</h3>
                            <ExpenseForm ref="expenseFormRef" @add="handleAddExpense" :loading="isCreatingExpense" />
                        </template>
                    </UModal>

                    <UModal id="filter-modal" class="mx-2">
                        <UButton icon="i-lucide-filter" :label="$t('home.form.filters')" color="neutral"
                            variant="solid" />

                        <template #content>
                            <div class="p-4">
                                <FilterTransactions :accountsOptions="accountsOptions"
                                    v-model:selectedType="selectedType" v-model:selectedAccounts="selectedAccounts"
                                    v-model:isListView="isListView" />
                            </div>
                        </template>
                    </UModal>
                </div>

                <div class="flex items-center justify-between">
                    <!-- Switch entre tableau et liste -->
                    <div class="flex items-center gap-3">
                        <span class="text-sm font-medium">
                            <UIcon name="i-lucide-table" class="size-5" />
                        </span>
                        <USwitch v-model="isListView" />
                        <span class="text-sm font-medium">
                            <UIcon name="i-lucide-list" class="size-5" />
                        </span>
                    </div>
                </div>
            </div>
        </template>
    </NavbarFixed>
</template>

<script setup lang="ts">
import NavbarFixed from '@/components/NavbarFixed.vue'
import ExpenseForm from './ExpenseForm.vue'
import FilterTransactions from './children/FilterTransactions.vue'
import type { IExpense } from '@/interfaces/IExpense'
import type { IAccounts } from '@/interfaces/IAccounts'

interface Props {
    accountsOptions?: IAccounts[]
    isCreatingExpense?: boolean
}

withDefaults(defineProps<Props>(), {
    accountsOptions: () => [],
    isCreatingExpense: false
})

const emit = defineEmits(['add'])

const selectedType = defineModel<string | undefined>('selectedType')
const selectedAccounts = defineModel<string[]>('selectedAccounts')
const isListView = defineModel<boolean>('isListView')

const handleAddExpense = (expense: IExpense) => {
    emit('add', expense)
}
</script>