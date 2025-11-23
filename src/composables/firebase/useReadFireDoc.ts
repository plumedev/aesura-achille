import { doc, getDoc, collection, getDocs, query, type QueryConstraint, type DocumentData } from 'firebase/firestore'
import { getDb } from '@/config/firebase'
import { useRequest } from '@/composables/utils/useRequest'
import { useToast } from '@nuxt/ui/composables'

export interface ReadFireDocParams {
  collectionName: string
  documentId?: string
  queryConstraints?: QueryConstraint[]
}

export function useReadFireDoc() {
  const runServices = async ({
    collectionName,
    documentId,
    queryConstraints
  }: ReadFireDocParams): Promise<DocumentData | DocumentData[] | null> => {
    try {
      const db = getDb()

      // Si un documentId est fourni, lire un document spécifique
      if (documentId) {
        const docRef = doc(db, collectionName, documentId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() }
        } else {
          return null
        }
      }
      // Sinon, lire tous les documents de la collection (avec éventuelles contraintes de requête)
      else {
        let q = query(collection(db, collectionName))

        if (queryConstraints && queryConstraints.length > 0) {
          q = query(collection(db, collectionName), ...queryConstraints)
        }

        const querySnapshot = await getDocs(q)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = querySnapshot.docs.map((docSnap: any) => ({
          id: docSnap.id,
          ...docSnap.data()
        }))

        // Utilisation directe du toast de NuxtUI via le composable global
        const { add } = useToast()
        add({
          title: 'Données récupérées avec succès !',
          color: 'success'
        })

        return result
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

  return useRequest<DocumentData | DocumentData[] | null>({
    runServices
  })
}
