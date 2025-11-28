<template>
  <UCard class="bg-muted/50">
    <UForm :state="formState" @submit="handleSubmit" class="flex flex-col md:flex-row md:justify-between gap-4">
      <div class="flex flex-col md:flex-row gap-4 w-full flex-1 md:w-auto">
        <UInput v-model="formState.name" :placeholder="$t('home.form.name')" size="lg" class="w-full md:flex-1" />
        <UInputNumber v-model="formState.amount" :increment="false" :decrement="false"
          :placeholder="$t('home.form.amount')" size="lg" class="w-full md:flex-1" />
        <USelect v-model="formState.account" :items="accountsOptions" :placeholder="$t('home.form.account')" size="lg"
          class="w-full md:flex-1" />
      </div>

      <div class="flex flex-row gap-2 w-full md:w-auto">
        <UButton type="button" variant="ghost" @click="resetForm" class="flex-1 md:flex-initial">
          {{ $t('home.form.reset') }}
        </UButton>
        <UButton type="submit" color="primary" :disabled="!isFormValid || props.loading" :loading="props.loading"
          class=" w-auto mx-auto">
          {{ $t('home.form.add') }}
        </UButton>
      </div>
    </UForm>
  </UCard>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { resolveComponent } from 'vue'
import type { Account, Expense } from './ExpenseTable.vue'
import { useReadFireDoc } from '@/composables/firebase/useReadFireDoc'

const USelect = resolveComponent('USelect')
const UInputNumber = resolveComponent('UInputNumber')

const { data: accounts, doRequest: getAccounts } = useReadFireDoc()

const props = defineProps<{
  loading?: boolean
}>()

const formState = ref({
  name: '',
  amount: null as number | null,
  account: null as Account | null
})

const isFormValid = computed(() => {
  return (
    formState.value.name.trim() !== '' &&
    formState.value.amount !== null &&
    formState.value.amount > 0 &&
    formState.value.account !== null
  )
})

const emit = defineEmits<{
  add: [expense: Expense]
}>()

const resetForm = () => {
  formState.value = {
    name: '',
    amount: null,
    account: null
  }
}

const handleSubmit = () => {
  if (!isFormValid.value) {
    return
  }

  const newExpense: Expense = {
    id: Date.now().toString(),
    name: formState.value.name,
    amount: formState.value.amount!,
    account: formState.value.account!,
    date: new Date().toISOString().split('T')[0],
    type: 'expense'
  }

  emit('add', newExpense)

}

const accountsOptions = computed(() => {
  return accounts.value?.map((account: any) => account.accountName)
})

onMounted(async () => {
  await getAccounts({
    collectionName: 'accounts'
  })
})

defineExpose({
  resetForm
})
</script>
