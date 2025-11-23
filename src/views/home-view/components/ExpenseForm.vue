<template>
  <UCard class="bg-muted/50">
    <UForm :state="formState" @submit="handleSubmit" class="flex flex-row justify-between gap-4">
      <div class="flex flex-row gap-4">
        <UInput v-model="formState.name" :placeholder="$t('home.form.name')" size="lg" />
        <UInputNumber v-model="formState.amount" :increment="false" :decrement="false"
          :placeholder="$t('home.form.amount')" size="lg" />
        <USelect v-model="formState.account" :items="accountsOptions" :placeholder="$t('home.form.account')" size="lg"
          width="full" />
      </div>

      <div>
        <UButton type="button" variant="ghost" @click="resetForm">
          {{ $t('home.form.reset') }}
        </UButton>
        <UButton type="submit" color="primary" :disabled="!isFormValid">
          {{ $t('home.form.add') }}
        </UButton>
      </div>
    </UForm>
  </UCard>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { resolveComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Account, Expense } from './ExpenseTable.vue'
import { useReadFireDoc } from '@/composables/firebase/useReadFireDoc'
import { useToast } from '@nuxt/ui/composables'

const USelect = resolveComponent('USelect')
const UInputNumber = resolveComponent('UInputNumber')

const { data: accounts, doRequest: getAccounts } = useReadFireDoc()

const { t } = useI18n()
const { add: addToast } = useToast()

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
    date: new Date().toISOString().split('T')[0]
  }

  emit('add', newExpense)
  resetForm()

  addToast({
    title: t('home.toast.add'),
    color: 'success',
    icon: 'i-lucide-circle-check'
  })
}

const accountsOptions = computed(() => {
  return accounts.value?.map((account: any) => account.accountName)
})

onMounted(async () => {
  await getAccounts({
    collectionName: 'accounts'
  })
})
</script>
