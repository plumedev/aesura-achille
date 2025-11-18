import { doc, deleteDoc } from 'firebase/firestore'
import { getDb } from '@/config/firebase'
import { useRequest } from '@/composables/utils/useRequest'

export interface DeleteFireDocParams {
  collectionName: string
  documentId: string
}

export function useDeleteFireDoc() {
  const runServices = async ({ collectionName, documentId }: DeleteFireDocParams): Promise<void> => {
    try {
      const db = getDb()
      await deleteDoc(doc(db, collectionName, documentId))
      // Utilisation directe du toast de NuxtUI via le composable global
      const { add } = useToast()
      add({
        title: 'Document supprimé avec succès !',
        color: 'success'
      })
    } catch (error: unknown) {
      const { add } = useToast()
      if (error instanceof Error) {
        add({
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
