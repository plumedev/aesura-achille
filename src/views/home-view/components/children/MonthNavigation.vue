<template>
    <div class="flex items-center justify-center gap-4">
        <UButton icon="i-lucide-chevron-left" color="neutral" variant="ghost" @click="handlePreviousMonth"
            :aria-label="previousMonthLabel" />
        <div class="text-lg font-semibold min-w-[180px] text-center">
            {{ formattedMonthYear }}
        </div>
        <UButton icon="i-lucide-chevron-right" color="neutral" variant="ghost" @click="handleNextMonth"
            :aria-label="nextMonthLabel" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { resolveComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { getPreviousMonth, getNextMonth, formatMonthYear, type MonthYear } from '@/helpers/DateFormat.helper'

const UButton = resolveComponent('UButton')

const { t } = useI18n()

const props = defineProps<{
    monthYear: MonthYear
}>()

const emit = defineEmits<{
    'update:monthYear': [value: MonthYear]
}>()

const formattedMonthYear = computed(() => {
    return formatMonthYear(props.monthYear.year, props.monthYear.month)
})

const previousMonthLabel = computed(() => t('home.navigation.previousMonth'))
const nextMonthLabel = computed(() => t('home.navigation.nextMonth'))

const handlePreviousMonth = () => {
    const previousMonth = getPreviousMonth(props.monthYear.year, props.monthYear.month)
    emit('update:monthYear', previousMonth)
}

const handleNextMonth = () => {
    const nextMonth = getNextMonth(props.monthYear.year, props.monthYear.month)
    emit('update:monthYear', nextMonth)
}
</script>
