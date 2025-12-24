<template>
  <UCard class="bg-muted/50">
    <UForm :state="formState" @submit="handleSubmit" class="flex flex-col md:flex-row md:justify-between gap-4">
      <div class="flex flex-col md:flex-row gap-4 w-full flex-1 md:w-auto">
        <UInput v-model="formState.name" :placeholder="$t('home.form.name')" size="lg" class="w-full md:flex-1" />
        <UInputNumber v-model="formState.amount" :increment="false" :decrement="false" :step="0.01"
          :placeholder="$t('home.form.amount')" size="lg" class="w-full md:flex-1" />
        <USelect v-model="formState.type" :items="transactionTypeOptions" :placeholder="$t('home.form.type')" size="lg"
          class="w-full md:flex-1" />
        <USelect v-model="formState.account" :items="accountsOptions" :placeholder="$t('home.form.account')" size="lg"
          class="w-full md:flex-1" />
      </div>

      <div class="flex flex-row gap-2 w-full md:w-auto">
        <UButton type="button" variant="ghost" @click="resetForm" class="flex-1 md:flex-initial">
          {{ $t('home.form.reset') }}
        </UButton>
        <UButton type="submit" color="primary" :disabled="!isFormValid || props.loading" :loading="props.loading"
          class="w-auto mx-auto">
          {{ isEditMode ? $t('home.form.update') : $t('home.form.add') }}
        </UButton>
      </div>
    </UForm>
  </UCard>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { resolveComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Account, IExpense } from '@/interfaces/IExpense'
import { useReadFireDoc } from '@/composables/firebase/useReadFireDoc'

const USelect = resolveComponent('USelect')
const UInputNumber = resolveComponent('UInputNumber')

const { t } = useI18n()
const { data: accounts, doRequest: getAccounts } = useReadFireDoc()

const props = defineProps<{
  loading?: boolean
  initialData?: IExpense | null
}>()

export type TransactionType = 'expense' | 'income'

const isEditMode = computed(() => !!props.initialData)

const formState = ref({
  name: '',
  amount: null as number | null,
  type: null as TransactionType | null,
  account: null as Account | null
})



const transactionTypeOptions = computed(() => [
  { label: t('home.form.expense'), value: 'expense' },
  { label: t('home.form.income'), value: 'income' }
])

const isFormValid = computed(() => {
  return (
    formState.value.name.trim() !== '' &&
    formState.value.amount !== null &&
    formState.value.amount > 0 &&
    formState.value.type !== null &&
    formState.value.account !== null
  )
})

const emit = defineEmits<{
  add: [expense: IExpense]
  update: [expense: IExpense]
}>()

const resetForm = () => {
  formState.value = {
    name: '',
    amount: null,
    type: null,
    account: null
  }
}

const handleSubmit = () => {
  if (!isFormValid.value) {
    return
  }

  const expense: IExpense = {
    id: props.initialData?.id || Date.now().toString(),
    name: formState.value.name,
    amount: formState.value.amount!,
    account: formState.value.account!,
    date: props.initialData?.date || new Date().toISOString().split('T')[0],
    type: formState.value.type!
  }

  if (isEditMode.value) {
    emit('update', expense)
  } else {
    emit('add', expense)
  }
}

const accountsOptions = computed(() => {
  return accounts.value?.map((account: any) => account.accountName)
})

onMounted(async () => {
  await getAccounts({
    collectionName: 'accounts'
  })
})

// Initialiser le formulaire avec les données initiales si fournies
watch(() => props.initialData, (newData) => {
  if (newData) {
    formState.value = {
      name: newData.name,
      amount: newData.amount,
      type: newData.type as TransactionType,
      account: newData.account
    }
  } else {
    resetForm()
  }
}, { immediate: true })

defineExpose({
  resetForm
})
</script>
