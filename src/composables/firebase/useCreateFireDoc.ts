import { collection, addDoc, type DocumentData } from 'firebase/firestore'
import { getDb } from '@/config/firebase'
import { useRequest } from '@/composables/utils/useRequest'
import { useToast } from '@nuxt/ui/composables'

export interface CreateFireDocParams {
  collectionName: string
  data: DocumentData
  showToast?: boolean
}

export function useCreateFireDoc() {
  // Appeler useToast() au niveau du setup, pas dans la fonction asynchrone
  const { add: addToast } = useToast()

  const runServices = async ({ collectionName, data, showToast = true }: CreateFireDocParams): Promise<string> => {
    try {
      const db = getDb()
      const docRef = await addDoc(collection(db, collectionName), data)
      if (showToast) {
        addToast({
          title: 'Document créé avec succès !',
          color: 'success'
        })
      }
      return docRef.id
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

  return useRequest<string>({
    runServices
  })
}
