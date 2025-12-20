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
        const { add } = useToast()
        add({
          title: 'Document modifié avec succès !',
          color: 'success'
        })
      }
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
