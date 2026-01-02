import { doc, deleteDoc } from 'firebase/firestore'
import { getDb } from '@/config/firebase'
import { useRequest } from '@/composables/utils/useRequest'
import { useToast } from '@nuxt/ui/composables'

export interface DeleteFireDocParams {
  collectionName: string
  documentId: string
  showToast?: boolean
}

export function useDeleteFireDoc() {
  const { add: addToast } = useToast()

  const runServices = async ({ collectionName, documentId, showToast = true }: DeleteFireDocParams): Promise<void> => {
    try {
      const db = getDb()
      await deleteDoc(doc(db, collectionName, documentId))
      if (showToast) {
        addToast({
          title: 'Transaction supprimée avec succès !',
          color: 'success'
        })
      }
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

  return useRequest<void>({
    runServices
  })
}
