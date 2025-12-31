<template>
  <UCard class="transaction-form">
    <h2 class="form-title mb-4">{{ editMode ? 'Modifier' : 'Créer' }} une transaction</h2>

    <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
      <!-- Ligne 1: Nom, Montant, Type -->
      <div class="flex flex-col md:flex-row gap-4">
        <UInput
          id="name"
          v-model="formData.name"
          placeholder="Nom de la transaction"
          size="lg"
          class="flex-1"
          required
        />
        <UInputNumber
          id="amount"
          v-model="formData.amount"
          :increment="false"
          :decrement="false"
          :step="0.01"
          placeholder="Montant"
          size="lg"
          class="flex-1"
          required
        />
        <USelect
          id="type"
          v-model="formData.type"
          :items="typeItems"
          placeholder="Type"
          size="lg"
          class="flex-1"
          required
        />
      </div>

      <!-- Ligne 2: Compte, Date d'effet -->
      <div class="flex flex-col md:flex-row gap-4">
        <USelect
          id="account"
          v-model="formData.account"
          :items="accountOptions"
          size="lg"
          placeholder="Compte"
          class="flex-1"
          required
        />
        <UInput
          id="effectDate"
          v-model="formData.effectDate"
          type="date"
          size="lg"
          class="flex-1"
          required
        />
      </div>

      <!-- Ligne 3: Périodicité -->
      <div class="form-group">
        <label class="form-label">Périodicité</label>
        <UTabs
          :items="periodicityItems"
          v-model="formData.periodicity"
          @update:model-value="handlePeriodicityChange"
          :ui="{
            wrapper: 'space-x-2',
            list: {
              background: 'bg-gray-100 dark:bg-gray-800',
              rounded: 'rounded-lg',
              padding: 'p-1',
              width: 'w-full'
            }
          }"
        />
      </div>

      <!-- Date de fin (si périodicité != unique) -->
      <div v-if="formData.periodicity !== 'unique'" class="form-group">
        <label for="effectEndDate" class="form-label">Date de fin de répétition</label>
        <UInput id="effectEndDate" v-model="formData.effectEndDate" type="date" size="lg" />
      </div>

      <!-- Actions -->
      <div class="flex flex-row gap-2 justify-end">
        <UButton type="button" variant="soft" color="white" @click="handleCancel">
          Annuler
        </UButton>
        <UButton
          type="submit"
          color="primary"
          :loading="loading"
        >
          {{ editMode ? 'Mettre à jour' : 'Créer' }}
        </UButton>
      </div>
    </form>
  </UCard>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import type {
  ITransaction,
  ITransactionForm,
  Periodicity,
  TransactionType
} from '@/interfaces/ITransaction'
import { useTransactions } from '@/composables/useTransactions'
import { useReadFireDoc } from '@/composables/firebase/useReadFireDoc'

interface Props {
  editTransaction?: ITransaction
}

const props = defineProps<Props>()
const emit = defineEmits<{
  submit: [transaction: ITransaction]
  cancel: []
}>()

const { calculateEndDate, formatDateForInput, addTransaction, updateTransaction } =
  useTransactions()
const { data: accounts, doRequest: getAccounts } = useReadFireDoc()
const loading = ref(false)
const editMode = ref(false)

const typeItems = [
  { label: 'Dépense', value: 'expense' },
  { label: 'Revenu', value: 'income' }
]

const periodicityItems = [
  { label: 'Unique', value: 'unique' },
  { label: 'Mensuelle', value: 'mensuelle' },
  { label: 'Trimestrielle', value: 'trimestrielle' },
  { label: 'Annuelle', value: 'annuelle' }
]

const accountOptions = computed(() => {
  return accounts.value?.map((account: any) => account.accountName) || []
})

const formData = ref<ITransactionForm>({
  name: '',
  amount: null,
  account: null as any,
  effectDate: formatDateForInput(new Date()),
  effectEndDate: undefined,
  periodicity: 'unique' as Periodicity,
  type: 'expense' as TransactionType
})

onMounted(async () => {
  await getAccounts({
    collectionName: 'accounts'
  })
})

const handlePeriodicityChange = (periodicity: Periodicity) => {
  if (periodicity !== 'unique' && formData.value.effectDate) {
    const startDate = new Date(formData.value.effectDate)
    const endDate = calculateEndDate(startDate, periodicity)
    formData.value.effectEndDate = formatDateForInput(endDate)
  } else {
    formData.value.effectEndDate = undefined
  }
}

const handleSubmit = async () => {
  loading.value = true

  try {
    if (editMode.value && props.editTransaction) {
      await updateTransaction(props.editTransaction.id, {
        name: formData.value.name,
        amount: formData.value.amount!,
        account: formData.value.account,
        effectDate: formData.value.effectDate,
        effectEndDate: formData.value.effectEndDate,
        periodicity: formData.value.periodicity,
        type: formData.value.type
      })
    } else {
      await addTransaction({
        name: formData.value.name,
        amount: formData.value.amount!,
        account: formData.value.account,
        creationDate: new Date().toISOString(),
        effectDate: formData.value.effectDate,
        effectEndDate: formData.value.effectEndDate,
        periodicity: formData.value.periodicity,
        type: formData.value.type
      })
    }

    // Reset form
    resetForm()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la transaction:', error)
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  resetForm()
  emit('cancel')
}

const resetForm = () => {
  formData.value = {
    name: '',
    amount: null,
    account: null as any,
    effectDate: formatDateForInput(new Date()),
    effectEndDate: undefined,
    periodicity: 'unique' as Periodicity,
    type: 'expense' as TransactionType
  }
}

// Watch for effectDate changes to recalculate end date
watch(
  () => formData.value.effectDate,
  (newDate) => {
    if (newDate && formData.value.periodicity !== 'unique') {
      handlePeriodicityChange(formData.value.periodicity)
    }
  }
)

// Initialize form if editing
onMounted(() => {
  if (props.editTransaction) {
    editMode.value = true
    formData.value = {
      name: props.editTransaction.name,
      amount: props.editTransaction.amount,
      account: props.editTransaction.account,
      effectDate: props.editTransaction.effectDate,
      effectEndDate: props.editTransaction.effectEndDate,
      periodicity: props.editTransaction.periodicity,
      type: props.editTransaction.type
    }
  }
})
</script>

<style scoped lang="scss">
.transaction-form {
  .form-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: rgb(250 250 250);
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-label {
    font-weight: 600;
    font-size: 0.875rem;
    color: rgb(250 250 250);
  }
}
</style>
