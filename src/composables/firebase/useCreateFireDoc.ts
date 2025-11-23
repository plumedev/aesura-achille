import { collection, addDoc, type DocumentData } from 'firebase/firestore'
import { getDb } from '@/config/firebase'
import { useRequest } from '@/composables/utils/useRequest'
import { useToast } from '@nuxt/ui/composables'

export interface CreateFireDocParams {
  collectionName: string
  data: DocumentData
}

export function useCreateFireDoc() {
  const runServices = async ({ collectionName, data }: CreateFireDocParams): Promise<string> => {
    try {
      const db = getDb()
      const docRef = await addDoc(collection(db, collectionName), data)
      // Utilisation directe du toast de NuxtUI via le composable global
      const { add } = useToast()
      add({
        title: 'Document créé avec succès !',
        color: 'success'
      })
      return docRef.id
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

  return useRequest<string>({
    runServices
  })
}
