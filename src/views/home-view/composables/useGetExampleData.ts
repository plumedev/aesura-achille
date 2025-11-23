import { getExampleData } from '@/api/example/exampleService'
import type { IExampleData } from '@/api/example/interfaces/IExampleData'
import { useRequest } from '@/composables/utils/useRequest'
import { useToast } from '@nuxt/ui/composables'

export function useGetExampleData() {
  const runServices = async (): Promise<IExampleData> => {
    try {
      const result = await getExampleData()
      // Utilisation directe du toast de NuxtUI via le composable global
      const { add } = useToast()
      add({
        title: 'Données récupérées avec succès !',
        color: 'success'
      })
      return result
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

  return useRequest<IExampleData>({
    runServices
  })
}
