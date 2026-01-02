import { collection, getDocs, query, where } from 'firebase/firestore'
import { getDb } from '@/config/firebase'
import { useRequest } from '@/composables/utils/useRequest'
import { useToast } from '@nuxt/ui/composables'
import type { IExpense } from '@/interfaces/IExpense'

export interface ReadTransactionsByMonthParams {
  collectionName: string
  year: number
  month: number
}

/**
 * Composable pour récupérer les transactions d'un mois et d'une année spécifiques
 */
export function useReadTransactionsByMonth() {
  const { add: addToast } = useToast()

  const runServices = async ({ collectionName, year, month }: ReadTransactionsByMonthParams): Promise<IExpense[]> => {
    try {
      const db = getDb()

      const startDate = new Date(year, month - 1, 1)
      const startDateString = startDate.toISOString().split('T')[0]

      const nextMonth = month === 12 ? 1 : month + 1
      const nextYear = month === 12 ? year + 1 : year
      const endDate = new Date(nextYear, nextMonth - 1, 1)
      const endDateString = endDate.toISOString().split('T')[0]

      const q = query(
        collection(db, collectionName),
        where('date', '>=', startDateString),
        where('date', '<', endDateString)
      )

      const querySnapshot = await getDocs(q)
      const result = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      })) as IExpense[]

      return result
    } catch (error: unknown) {
      if (error instanceof Error) {
        addToast({
          title: error.message,
          color: 'error'
        })
      }
      throw error
    }
  }

  return useRequest<IExpense[]>({
    runServices
  })
}
