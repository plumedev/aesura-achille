<template>
  <UTable :data="modelValue" :columns="columns" />
</template>

<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import type { TableColumn } from '@nuxt/ui'
import type { Row } from '@tanstack/vue-table'
import { useToast } from '@nuxt/ui/composables'

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const { t } = useI18n()
const { add: addToast } = useToast()

export type Account = 'CIC' | 'Revolut' | 'Crypto.com'

export interface Expense {
  id: string
  name: string
  amount: number
  account: Account
  date: string
}

const props = defineProps<{
  modelValue: Expense[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Expense[]]
}>()

const deleteExpense = (id: string) => {
  const updatedExpenses = props.modelValue.filter(expense => expense.id !== id)
  emit('update:modelValue', updatedExpenses)

  addToast({
    title: t('home.toast.delete'),
    color: 'success',
    icon: 'i-lucide-circle-check'
  })
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

      const formatted = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(amount)

      return h('div', { class: 'text-right font-medium' }, formatted)
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
