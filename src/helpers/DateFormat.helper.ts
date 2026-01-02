/**
 * Helper pour la gestion de la navigation et du formatage des dates/mois
 */

import type { IExpense } from '@/interfaces/IExpense'
import { CalendarDate, parseDate } from '@internationalized/date'

export interface MonthYear {
  year: number
  month: number // 1-12 (janvier = 1, décembre = 12)
}

/**
 * Retourne le mois et l'année actuels
 * @returns Un objet { year, month } représentant le mois actuel
 */
export function getCurrentMonth(): MonthYear {
  const now = new Date()
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1 // getMonth() retourne 0-11, on convertit en 1-12
  }
}

/**
 * Retourne le mois précédent
 * @param year - L'année du mois de référence
 * @param month - Le mois de référence (1-12)
 * @returns Un objet { year, month } représentant le mois précédent
 */
export function getPreviousMonth(year: number, month: number): MonthYear {
  let prevMonth = month - 1
  let prevYear = year

  // Si on est en janvier (mois 1), on passe à décembre de l'année précédente
  if (prevMonth < 1) {
    prevMonth = 12
    prevYear--
  }

  return {
    year: prevYear,
    month: prevMonth
  }
}

/**
 * Retourne le mois suivant
 * @param year - L'année du mois de référence
 * @param month - Le mois de référence (1-12)
 * @returns Un objet { year, month } représentant le mois suivant
 */
export function getNextMonth(year: number, month: number): MonthYear {
  let nextMonth = month + 1
  let nextYear = year

  // Si on est en décembre (mois 12), on passe à janvier de l'année suivante
  if (nextMonth > 12) {
    nextMonth = 1
    nextYear++
  }

  return {
    year: nextYear,
    month: nextMonth
  }
}

/**
 * Formate un mois/année pour l'affichage (ex: "Janvier 2024")
 * @param year - L'année
 * @param month - Le mois (1-12)
 * @param locale - La locale pour le formatage (par défaut: 'fr-FR')
 * @returns Le mois/année formaté en français
 */
export function formatMonthYear(year: number, month: number, locale: string = 'fr-FR'): string {
  const date = new Date(year, month - 1, 1) // month - 1 car Date utilise 0-11
  return new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric'
  }).format(date)
}

/**
 * Vérifie si une date (string ISO) appartient au mois/année spécifié
 * @param dateString - La date au format ISO string (ex: "2024-01-15")
 * @param year - L'année à comparer
 * @param month - Le mois à comparer (1-12)
 * @returns true si la date appartient au mois/année, false sinon
 */
export function isDateInMonth(dateString: string, year: number, month: number): boolean {
  try {
    const date = new Date(dateString)
    const dateYear = date.getFullYear()
    const dateMonth = date.getMonth() + 1 // Conversion de 0-11 vers 1-12

    return dateYear === year && dateMonth === month
  } catch {
    return false
  }
}

/**
 * Retourne les transactions du mois précédent à partir de l'année et du mois spécifiés
 * @param transactions - Les transactions à filtrer
 * @param year - L'année à comparer
 * @param month - Le mois à comparer (1-12)
 * @returns Les transactions du mois précédent
 */

export function getPreviousMonthTransactions(transactions: IExpense[], year: number, month: number): IExpense[] {
  return transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date)
    return transactionDate.getFullYear() === year && transactionDate.getMonth() === month
  })
}

/**
 * Projette une date vers un mois/année cible en gérant les dépassements de jours (ex: 30 janvier -> 28/29 février)
 * @param sourceDate - La date source (string ISO "YYYY-MM-DD")
 * @param targetYear - L'année cible
 * @param targetMonth - Le mois cible (1-12)
 * @returns La nouvelle date au format ISO "YYYY-MM-DD"
 */
export function projectDateToMonth(sourceDate: string, targetYear: number, targetMonth: number): string {
  const date = new Date(sourceDate)
  const originalDay = date.getDate()

  const targetDate = new Date(targetYear, targetMonth - 1, 1)

  targetDate.setDate(originalDay)

  if (targetDate.getMonth() !== targetMonth - 1) {
    targetDate.setDate(0)
  }

  // Format YYYY-MM-DD manuel pour éviter les problèmes de timezone
  const y = targetDate.getFullYear()
  const m = String(targetDate.getMonth() + 1).padStart(2, '0')
  const d = String(targetDate.getDate()).padStart(2, '0')

  return `${y}-${m}-${d}`
}

/**
 * Convertit une date string en objet CalendarDate pour les composants de date NuxtUI
 * @param dateString - La date au format string (ex: "YYYY-MM-DD" ou autre format)
 * @returns Un objet CalendarDate compatible avec UInputDate
 */
export function parseDateString(dateString: string): CalendarDate {
  try {
    // Format attendu: "YYYY-MM-DD"
    return parseDate(dateString)
  } catch {
    // Si le parsing échoue, utiliser new Date() comme fallback
    const date = new Date(dateString)
    return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
  }
}
