/**
 * Formate un nombre en devise EUR avec le format français
 * @param amount - Le montant à formater
 * @param currency - La devise (par défaut: 'EUR')
 * @param locale - La locale (par défaut: 'fr-FR')
 * @returns Le montant formaté (ex: "1 234,56 €")
 */
export function formatCurrency(amount: number, currency: string = 'EUR', locale: string = 'fr-FR'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(amount)
}
