<template>
  <div
    class="flex items-center justify-between p-4 rounded-lg border-l-4 border-y-0 border-r-0 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mb-4"
    :class="transaction.type === 'income' ? 'border-green-500' : 'border-red-400'"
  >
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-3">
        <div class="shrink-0">
          <UIcon
            :name="transaction.type === 'income' ? 'i-lucide-arrow-up-circle' : 'i-lucide-arrow-down-circle'"
            :class="transaction.type === 'income' ? 'text-green-500' : 'text-red-400'"
            class="w-5 h-5"
          />
        </div>
        <div class="flex-1 min-w-0">
          <div class="font-semibold text-gray-900 dark:text-gray-100 truncate">
            {{ transaction.name }}
          </div>
          <div class="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
            <UBadge :color="getAccountColor(transaction.account)" variant="soft" size="xs">
              {{ transaction.account }}
            </UBadge>
            <span>{{ formatDate(transaction.effectDate) }}</span>
            <UBadge variant="soft" size="xs">
              {{ getPeriodicityLabel(transaction.periodicity) }}
            </UBadge>
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-4 ml-4">
      <div :class="`text-lg font-bold ${transaction.type === 'income' ? 'text-green-500' : 'text-red-400'}`">
        {{ transaction.type === 'income' ? '+' : '-' }}{{ formatAmount(transaction.amount) }}
      </div>

      <UDropdownMenu :items="getItemActions()" :content="{ align: 'end' }" aria-label="Actions dropdown">
        <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" aria-label="Actions dropdown" />
      </UDropdownMenu>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ITransaction, Periodicity } from '@/interfaces/ITransaction'
import { formatCurrency } from '@/helpers/NumberFormat.helper'

interface Props {
  transaction: ITransaction
}

const props = defineProps<Props>()
const emit = defineEmits<{
  edit: [transaction: ITransaction]
  delete: [id: string]
}>()

const formatAmount = (amount: number): string => {
  return formatCurrency(amount).replace(/\s?€/, '')
}

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date)
  } catch {
    return dateString
  }
}

const getPeriodicityLabel = (periodicity: Periodicity): string => {
  const labels: Record<Periodicity, string> = {
    unique: 'Unique',
    mensuelle: 'Mensuelle',
    trimestrielle: 'Trimestrielle',
    annuelle: 'Annuelle'
  }
  return labels[periodicity]
}

const getAccountColor = (account: string): 'primary' | 'neutral' | 'info' => {
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

const handleEdit = () => {
  emit('edit', props.transaction)
}

const handleDelete = () => {
  emit('delete', props.transaction.id)
}

const getItemActions = () => {
  return [
    {
      type: 'label' as const,
      label: 'Actions'
    },
    {
      label: 'Supprimer',
      icon: 'i-lucide-trash-2',
      onSelect() {
        handleDelete()
      }
    },
    {
      label: 'Modifier',
      icon: 'i-lucide-edit',
      onSelect() {
        handleEdit()
      }
    }
  ]
}
</script>

<style scoped lang="scss"></style>
