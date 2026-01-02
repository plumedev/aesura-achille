<template>
  <div class="flex flex-col  md:flex-row items-start md:items-center gap-4 my-4">

    <!-- Filtre par type -->
    <div class="flex items-center gap-4">
      <label class="text-sm font-medium">{{ $t('home.filter.type') }}</label>
      <USelect v-model="type" :items="typeFilterOptions" :placeholder="$t('home.filter.allTypes')" class="w-48"
        clearable />
    </div>

    <!-- Filtre par compte -->
    <div class="flex items-center gap-4">
      <label class="text-sm font-medium">{{ $t('home.filter.account') }}</label>
      <USelectMenu v-model="accounts" :items="accountFilterOptions" :placeholder="$t('home.filter.allAccounts')"
        class="w-48" multiple />
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ITransaction } from '@/interfaces/ITransaction'

const props = defineProps<{
  transactions?: ITransaction[] | null
}>()

const type = defineModel<'expense' | 'income' | undefined>('selectedType', { default: undefined })
const accounts = defineModel<string[]>('selectedAccounts', { default: () => [] })

const { t } = useI18n()

const typeFilterOptions = computed(() => [
  { label: t('home.filter.allTypes'), value: undefined },
  { label: t('home.form.expense'), value: 'expense' },
  { label: t('home.form.income'), value: 'income' }
])

const accountFilterOptions = computed(() => {
  return ['cic', 'revolut', 'crypto.com']
})
</script>
