<template>
    <!-- Filtres -->
    <div class="flex flex-col justify-between md:flex-row items-start md:items-center gap-4 my-4">
        <!-- Filtre par type -->
        <div class="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div class="flex items-center gap-4">
                <label class="text-sm font-medium">{{ $t('home.filter.type') }}</label>
                <USelect v-model="type" :items="typeFilterOptions" :placeholder="$t('home.filter.allTypes')"
                    class="w-48" clearable />
            </div>
            <!-- Filtre par compte -->
            <div class="flex items-center gap-4">
                <label class="text-sm font-medium">{{ $t('home.filter.account') }}</label>
                <USelectMenu v-model="accounts" :items="accountFilterOptions"
                    :placeholder="$t('home.filter.allAccounts')" class="w-48" multiple />
            </div>
        </div>

        <div class="flex items-center justify-between">
            <UButton class="mr-2" icon="i-lucide-import" :label="$t('home.modal.importPreviousMonth.button')"
                color="primary" variant="solid" to="/import-previous-month" />
            <!-- Switch entre tableau et liste -->
            <div class="flex items-center gap-3">
                <span class="text-sm font-medium">{{ $t('home.view.table') }}</span>
                <USwitch v-model="listView" />
                <span class="text-sm font-medium">{{ $t('home.view.list') }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
    accountsOptions: {
        type: Array,
        default: () => []
    }
})

const type = defineModel('selectedType', { default: undefined })
const accounts = defineModel('selectedAccounts', { default: [] })
const listView = defineModel('isListView', { default: true })

const { t } = useI18n()

const typeFilterOptions = computed(() => [
    { label: t('home.filter.allTypes'), value: undefined },
    { label: t('home.form.expense'), value: 'expense' },
    { label: t('home.form.income'), value: 'income' }
])

const accountFilterOptions = computed(() => {
    if (props.accountsOptions) {
        return props.accountsOptions.map((account) => account.accountName)
    }
    return []
})
</script>