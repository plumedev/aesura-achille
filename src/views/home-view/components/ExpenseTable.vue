<template>
  <div class="flex flex-col max-h-[60vh]">
    <div class="overflow-y-auto flex-1">
      <UTable
        :data="modelValue"
        :columns="columns"
        :loading="loading"
        loading-animation="carousel"
        loading-color="primary"
      />
    </div>
    <!-- Footer fixe -->
    <div class="sticky bottom-0 bg-background border-t border-gray-200 dark:border-gray-700 z-10">
      <div class="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 py-3">
        <div class="text-left font-bold">{{ t('home.table.total') }}</div>
        <div class="text-right space-y-1">
          <div class="font-bold">{{ t('home.table.total') }}</div>
          <div class="text-sm text-red-400">{{ t('home.table.expenses') }}: {{ formattedTotalExpenses }}</div>
          <div class="text-sm text-green-500">{{ t('home.table.income') }}: {{ formattedTotalIncome }}</div>
          <div :class="`text-sm font-semibold ${balance >= 0 ? 'text-green-500' : 'text-red-400'}`">
            {{ t('home.table.balance') }}: {{ formattedBalance }}
          </div>
        </div>
        <div></div>
        <div></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h, resolveComponent, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { TableColumn } from '@nuxt/ui'
import type { Row } from '@tanstack/vue-table'
import { formatCurrency } from '@/helpers/NumberFormat.helper'

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const { t } = useI18n()

export type Account = 'CIC' | 'Revolut' | 'Crypto.com'

export interface Expense {
  id: string
  name: string
  amount: number
  account: Account
  date: string
  type: string
}

const props = defineProps<{
  modelValue: Expense[]
  loading: boolean
}>()

const totalExpenses = computed(() => {
  return props.modelValue
    .filter((expense) => expense.type === 'expense')
    .reduce((sum, expense) => sum + (expense.amount || 0), 0)
})

const totalIncome = computed(() => {
  return props.modelValue
    .filter((expense) => expense.type === 'income')
    .reduce((sum, expense) => sum + (expense.amount || 0), 0)
})

const balance = computed(() => {
  return totalIncome.value - totalExpenses.value
})

const formattedTotalExpenses = computed(() => {
  return formatCurrency(totalExpenses.value)
})

const formattedTotalIncome = computed(() => {
  return formatCurrency(totalIncome.value)
})

const formattedBalance = computed(() => {
  return formatCurrency(balance.value)
})

const emit = defineEmits<{
  'update:modelValue': [value: Expense[]]
  delete: [id: string]
}>()

const deleteExpense = (id: string) => {
  emit('delete', id)
}

const getAccountColor = (account: Account): 'primary' | 'neutral' | 'info' => {
  switch (account) {
    case 'CIC':
      return 'primary'
    case 'Revolut':
      return 'neutral'
    case 'Crypto.com':
      return 'info'
    default:
      return 'primary'
  }
}

function getRowItems(row: Row<Expense>) {
  return [
    {
      type: 'label',
      label: t('home.table.actions')
    },
    {
      label: t('home.table.delete'),
      icon: 'i-lucide-trash-2',
      onSelect() {
        deleteExpense(row.original.id)
      }
    }
  ]
}

const columns: TableColumn<Expense>[] = [
  {
    accessorKey: 'name',
    header: () => h('div', { class: 'text-left' }, t('home.table.name'))
  },
  {
    accessorKey: 'amount',
    header: () => h('div', { class: 'text-right' }, t('home.table.amount')),
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue('amount'))
      const formatted = formatCurrency(amount)
      const transactionType = row.original.type
      const colorClass = transactionType === 'income' ? 'text-green-500' : 'text-red-400'

      return h('div', { class: `text-right font-medium ${colorClass}` }, formatted)
    }
  },
  {
    accessorKey: 'account',
    header: () => h('div', { class: 'text-left' }, t('home.table.account')),
    cell: ({ row }) => {
      const account = row.getValue('account') as Account
      const color = getAccountColor(account)

      return h(UBadge, { variant: 'soft', color }, () => account)
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-right' },
        h(
          UDropdownMenu,
          {
            content: {
              align: 'end'
            },
            items: getRowItems(row),
            'aria-label': 'Actions dropdown'
          },
          () =>
            h(UButton, {
              icon: 'i-lucide-ellipsis-vertical',
              color: 'neutral',
              variant: 'ghost',
              class: 'ml-auto',
              'aria-label': 'Actions dropdown'
            })
        )
      )
    }
  }
]
</script>
