<template>
  <div class="flex flex-col  md:flex-row items-start md:items-center gap-4 my-4">

    <!-- Filtre par type -->
    <div class="flex items-center gap-4">
      <label class="text-sm font-medium">{{ $t('Transactions.filter.type') }}</label>
      <USelect v-model="type" :items="typeFilterOptions" :placeholder="$t('Transactions.filter.allTypes')" class="w-48"
        clearable />
    </div>

    <!-- Filtre par compte -->
    <div class="flex items-center gap-4">
      <label class="text-sm font-medium">{{ $t('Transactions.filter.account') }}</label>
      <USelectMenu v-model="accounts" :items="accountFilterOptions" :placeholder="$t('Transactions.filter.allAccounts')"
        class="w-48" multiple />
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ITransaction } from '@/interfaces/ITransaction'

defineProps<{
  transactions?: ITransaction[] | null
}>()

const type = defineModel<'expense' | 'income' | undefined>('selectedType', { default: undefined })
const accounts = defineModel<string[]>('selectedAccounts', { default: () => [] })

const { t } = useI18n()

const typeFilterOptions = computed(() => [
  { label: t('Transactions.filter.allTypes'), value: undefined },
  { label: t('Transactions.form.expense'), value: 'expense' },
  { label: t('Transactions.form.income'), value: 'income' }
])

const accountFilterOptions = computed(() => {
  return ['cic', 'revolut', 'crypto.com']
})
</script>
