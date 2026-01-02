<template>
  <UForm class="flex flex-col gap-y-4">

    <div class="flex flex-row gap-4 items-center w-full">
      <UInput id="transactions-form-name" v-model="formState.name" :placeholder="$t('Transactions.form.name')"
        class="w-full" />
      <UInput id="transactions-form-amount" v-model="formState.amount" :placeholder="$t('Transactions.form.amount')"
        class="w-full" />
      <USelect id="transactions-form-account" v-model="formState.account" :items="accountOptions"
        :placeholder="$t('Transactions.form.account')" class="min-w-[150px] w-full" />
    </div>

    <div class="flex flex-col w-full">
      <p class="text-sm">{{ $t('Transactions.form.frequencyTitle') }}</p>
      <UTabs id="transactions-form-frequency" class="-mt-3 -mb-2" v-model="formState.frequency"
        :items="frequencyOptions" />
    </div>

    <div class="flex flex-row gap-x-4 w-full">
      <UFormField :label="$t('Transactions.form.endAndStartDate')">
        <UInputDate id="transactions-form-effect-date" ref="inputEffectDate" v-model="mvDateRange" locale="fr-FR" range>
          <template #trailing>
            <UPopover :reference="inputEffectDate?.inputsRef[0]?.$el">
              <UButton color="neutral" variant="link" size="sm" icon="i-lucide-calendar"
                :aria-label="$t('Transactions.form.selectDate')" class="px-0" />

              <template #content>
                <UCalendar v-model="mvDateRange" class="p-2" :number-of-months="2" locale="fr-FR" range />
              </template>
            </UPopover>
          </template>
        </UInputDate>
      </UFormField>
      <UFormField :label="$t('Transactions.form.type')">
        <USelect id="transactions-form-type" v-model="formState.type" :items="transactionTypeOptions"
          :placeholder="$t('Transactions.form.type')" class="min-w-[150px] w-full" />
      </UFormField>

    </div>

    <div class="flex flex-row justify-end gap-x-4 w-full">
      <UButton id="transactions-form-submit" type="submit" color="primary" :disabled="!isFormValid"
        :loading="isCreatingTransaction || isUpdatingTransaction" @click="handleSubmit">{{
          props.formToEdit ? $t('Transactions.form.update') : $t('Transactions.form.create') }}</UButton>
    </div>
  </UForm>
</template>

<script setup lang="ts">
import { useCreateFireDoc } from '@/composables/firebase/useCreateFireDoc'
import { useUpdateFireDoc } from '@/composables/firebase/useUpdateFireDoc'
import { parseDateString } from '@/helpers/DateFormat.helper'
import { Frequency } from '@/enums/Frequency.enum'
import { TransactionsType } from '@/enums/TransactionsType.enum'
import type { ITransaction } from '@/interfaces/ITransaction'
import { CalendarDate } from '@internationalized/date'
import type { TabsItem } from '@nuxt/ui'
import { computed, ref, resolveComponent, shallowRef, useTemplateRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  createTransaction: []
}>()

const props = defineProps<{
  formState?: ITransaction | null
  formToEdit?: ITransaction | null
}>()


const { t } = useI18n()
const UTabs = resolveComponent('UTabs')
const inputEffectDate = useTemplateRef('inputEffectDate')

const { doRequest: createTransaction, isLoading: isCreatingTransaction } = useCreateFireDoc()
const { doRequest: updateTransaction, isLoading: isUpdatingTransaction } = useUpdateFireDoc()

const transactionTypeOptions = computed(() => [
  { label: t('Transactions.form.expense'), value: TransactionsType.EXPENSE },
  { label: t('Transactions.form.income'), value: TransactionsType.INCOME }
])

const accountOptions = computed(() => [
  { label: 'CIC', value: 'cic' },
  { label: 'Revolut', value: 'revolut' },
  { label: 'Crypto.com', value: 'crypto.com' }
])

const frequencyOptions = ref<TabsItem[]>([
  { label: t('Transactions.form.unique'), value: Frequency.UNIQUE },
  { label: t('Transactions.form.monthly'), value: Frequency.MONTHLY },
  { label: t('Transactions.form.quarterly'), value: Frequency.QUARTERLY },
  { label: t('Transactions.form.yearly'), value: Frequency.YEARLY }
])

const mvDateRange = shallowRef({
  start: new CalendarDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()),
  end: new CalendarDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())
})

const formState = ref<{
  name: string
  amount: number | null
  type: TransactionsType
  account: string
  frequency: Frequency
  effectDate: CalendarDate
  effectEndDate: CalendarDate
}>({
  name: '',
  amount: null,
  type: TransactionsType.EXPENSE,
  account: accountOptions.value[0].value,
  frequency: Frequency.UNIQUE,
  effectDate: new CalendarDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()),
  effectEndDate: new CalendarDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())
})

const isFormValid = computed(() => {
  return (
    formState.value.name.trim() !== '' &&
    formState.value.amount !== 0 &&
    formState.value.type !== null &&
    formState.value.account !== null &&
    formState.value.frequency !== null &&
    mvDateRange.value.start !== null &&
    mvDateRange.value.end !== null
  )
})

const initializeFormFromTransaction = (transaction: ITransaction) => {
  const typeValue = Object.values(TransactionsType).includes(transaction.type as TransactionsType)
    ? (transaction.type as TransactionsType)
    : TransactionsType.EXPENSE

  const frequencyValue = Object.values(Frequency).includes(transaction.frequency as Frequency)
    ? (transaction.frequency as Frequency)
    : Frequency.UNIQUE

  formState.value = {
    name: transaction.name || '',
    amount: transaction.amount ?? null,
    type: typeValue,
    account: transaction.account || accountOptions.value[0].value,
    frequency: frequencyValue,
    effectDate: transaction.effectDate ? parseDateString(transaction.effectDate) : new CalendarDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()),
    effectEndDate: transaction.effectEndDate ? parseDateString(transaction.effectEndDate) : new CalendarDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())
  }

  mvDateRange.value = {
    start: transaction.effectDate ? parseDateString(transaction.effectDate) : new CalendarDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()),
    end: transaction.effectEndDate ? parseDateString(transaction.effectEndDate) : new CalendarDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())
  }
}

const resetForm = () => {
  formState.value = {
    name: '',
    amount: null,
    type: TransactionsType.EXPENSE,
    account: accountOptions.value[0].value,
    frequency: Frequency.UNIQUE,
    effectDate: new CalendarDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()),
    effectEndDate: new CalendarDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())
  }
  mvDateRange.value = {
    start: new CalendarDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()),
    end: new CalendarDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())
  }
}

const handleSubmit = async () => {
  if (props.formToEdit) {
    await handleUpdateTransaction()
  } else {
    await handleAddTransaction()
  }
  resetForm()
}

const handleAddTransaction = async () => {
  const transactionData = {
    name: formState.value.name,
    amount: formState.value.amount,
    type: formState.value.type,
    account: formState.value.account,
    frequency: formState.value.frequency,
    effectDate: mvDateRange.value.start.toString(),
    effectEndDate: mvDateRange.value.end.toString()
  }
  await createTransaction({
    collectionName: 'transactions',
    data: transactionData
  })
  emit('createTransaction')
}

const handleUpdateTransaction = async () => {
  if (!props.formToEdit?.id) return

  const transactionData = {
    name: formState.value.name,
    amount: formState.value.amount,
    type: formState.value.type,
    account: formState.value.account,
    frequency: formState.value.frequency,
    effectDate: mvDateRange.value.start.toString(),
    effectEndDate: mvDateRange.value.end.toString()
  }
  await updateTransaction({
    collectionName: 'transactions',
    documentId: props.formToEdit.id,
    data: transactionData
  })
  emit('createTransaction')
  resetForm()
}



watch(() => props.formToEdit, (transaction) => {
  if (transaction) {
    initializeFormFromTransaction(transaction)
  }
}, { immediate: true })

watch(() => formState.value.frequency, (newFrequency) => {
  if (newFrequency === Frequency.UNIQUE) {
    mvDateRange.value = {
      start: mvDateRange.value.start,
      end: new CalendarDate(mvDateRange.value.start.year, mvDateRange.value.start.month, mvDateRange.value.start.day)
    }
  }
  if (newFrequency === Frequency.MONTHLY) {
    mvDateRange.value = {
      start: mvDateRange.value.start,
      end: new CalendarDate(mvDateRange.value.start.year, mvDateRange.value.start.month + 1, mvDateRange.value.start.day)
    }
  }
  if (newFrequency === Frequency.QUARTERLY) {
    mvDateRange.value = {
      start: mvDateRange.value.start,
      end: new CalendarDate(mvDateRange.value.start.year, mvDateRange.value.start.month + 3, mvDateRange.value.start.day)
    }
  }
  if (newFrequency === Frequency.YEARLY) {
    mvDateRange.value = {
      start: mvDateRange.value.start,
      end: new CalendarDate(mvDateRange.value.start.year + 1, mvDateRange.value.start.month, mvDateRange.value.start.day)
    }
  }
}, { immediate: true })
</script>
