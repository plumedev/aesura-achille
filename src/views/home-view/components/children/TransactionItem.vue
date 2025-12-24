<template>
  <div
    class="flex items-center justify-between p-4 rounded-lg border-l-4 border-y-0 border-r-0 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mb-4"
    :class="[transaction.type === 'income' ? 'border-green-500' : 'border-red-400', selectable ? 'cursor-pointer' : '']"
    @click="toggleSelection">
    <!-- Checkbox pour le mode sélectionnable -->
    <div v-if="selectable" class="shrink-0 mr-3" @click.stop>
      <UCheckbox v-model="isSelected" />
    </div>

    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-3">
        <div class="shrink-0">
          <UIcon :name="transaction.type === 'income' ? 'i-lucide-arrow-up-circle' : 'i-lucide-arrow-down-circle'"
            :class="transaction.type === 'income' ? 'text-green-500' : 'text-red-400'" class="w-5 h-5" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="font-semibold text-gray-900 dark:text-gray-100 truncate">
            {{ transaction.name }}
          </div>
          <div class="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
            <UBadge :color="getAccountColor(transaction.account)" variant="soft" size="xs">
              {{ transaction.account }}
            </UBadge>
            <span>{{ formatDate(transaction.date) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-4 ml-4">

      <div :class="`text-lg font-bold ${transaction.type === 'income' ? 'text-green-500' : 'text-red-400'}`">
        {{ transaction.type === 'income' ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
      </div>

      <UDropdownMenu v-if="!selectable || allowActions" :items="getItemActions()" :content="{ align: 'end' }"
        aria-label="Actions dropdown">
        <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" aria-label="Actions dropdown" />
      </UDropdownMenu>

    </div>
  </div>

  <UModal id="edit-transaction-modal" class="max-w-6xl" v-model:open="open">
    <template #content>
      <h3 class="p-4 text-lg font-bold">{{ $t('home.form.update') }}</h3>
      <div class="p-4">
        <ExpenseForm :initial-data="transaction" :loading="loading" @update="handleUpdate" @add="handleUpdate" />
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { resolveComponent, ref, watch } from 'vue'
import type { Account, IExpense } from '@/interfaces/IExpense'
import { formatCurrency } from '@/helpers/NumberFormat.helper'
import ExpenseForm from '../ExpenseForm.vue'

const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UModal = resolveComponent('UModal')
const UCheckbox = resolveComponent('UCheckbox')

const open = ref(false)

const { t } = useI18n()

const props = defineProps<{
  transaction: IExpense
  loading?: boolean
  selectable?: boolean // Mode sélectionnable (pour la modal d'import)
  selected?: boolean // État de sélection (contrôlé depuis le parent)
  allowActions?: boolean
}>()

const emit = defineEmits<{
  'delete': [id: string]
  'update': [expense: IExpense]
  'select': [id: string, selected: boolean] // Événement émis quand la sélection change
}>()



const isSelected = ref(props.selected ?? false)


const toggleSelection = () => {
  if (props.selectable) {
    isSelected.value = !isSelected.value
  }
}

watch(isSelected, (val) => {
  emit('select', props.transaction.id, val)
})

watch(() => props.selected, (val) => {
  if (val !== undefined) {
    isSelected.value = val
  }
})

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

const handleDelete = () => {
  emit('delete', props.transaction.id)
}

const handleEdit = () => {
  open.value = true
}

const handleUpdate = (expense: IExpense) => {
  emit('update', expense)
  open.value = false
}

const getItemActions = () => {
  return [
    {
      type: 'label',
      label: t('home.table.actions')
    },
    {
      label: t('home.table.delete'),
      icon: 'i-lucide-trash-2',
      onSelect() {
        handleDelete()
      }
    },
    {
      label: t('home.table.edit'),
      icon: 'i-lucide-edit',
      onSelect() {
        handleEdit()
      }
    }
  ]
}
</script>
