import { doc, updateDoc, type DocumentData } from 'firebase/firestore'
import { getDb } from '@/config/firebase'
import { useRequest } from '@/composables/utils/useRequest'
import { useToast } from '@nuxt/ui/composables'

export interface UpdateFireDocParams {
  collectionName: string
  documentId: string
  data: Partial<DocumentData>
  showToast?: boolean
}

export function useUpdateFireDoc() {
  const { add: addToast } = useToast()

  const runServices = async ({
    collectionName,
    documentId,
    data,
    showToast = true
  }: UpdateFireDocParams): Promise<void> => {
    try {
      const db = getDb()
      await updateDoc(doc(db, collectionName, documentId), data)
      if (showToast) {
        addToast({
          title: 'Transaction modifiée avec succès !',
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
